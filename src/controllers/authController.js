// src/controllers/authController.js
const { verifyPassword } = require('../utils/password.js');
const { ok, badRequest, unauthorized, serverError } = require('../utils/response.js');
const { findUserByEmail, isActive } = require('../models/usersModel.js');
const { signToken } = require('../middleware/jwtAuth.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { findActiveSession, createSession, deactivateSession } = require('../models/sessionModel.js');
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env.js');
const Actions = require('../audit/actions.js'); // centralized audit action constants

/**
 * Login controller
 */
async function login(req, res) {
  const { email_id, password } = req.body || {};
  if (!email_id || !password) {
    return badRequest(res, 'email_id and password are required', 'VALIDATION');
  }

  try {
    const user = await findUserByEmail(email_id);
    if (!user || !isActive(user.emp_status)) {
      await auditLog({ action: Actions.LOGIN_FAILURE, actor: { email_id }, req });
      return unauthorized(res, 'Invalid credentials');
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
      await auditLog({ action: Actions.LOGIN_FAILURE, actor: { email_id }, req });
      return unauthorized(res, 'Invalid credentials');
    }

    // Prevent multiple logins
    const activeSession = await findActiveSession(user.emp_id);
    if (activeSession) {
      await auditLog({ action: Actions.LOGIN_FAILURE, actor: { emp_id: user.emp_id, email_id }, req, meta: { reason: 'already_logged_in' } });
      return unauthorized(res, 'User already logged in');
    }

    const jti = randomUUID();
    const accessToken = signToken({ emp_id: user.emp_id, jti }, env.jwt.expiry);
    const refreshToken = jwt.sign(
      { emp_id: user.emp_id, jti },
      env.jwt.secret,
      { expiresIn: '7d', issuer: env.jwt.issuer }
    );

    await createSession({
      emp_id: user.emp_id,
      email_id: user.email_id,
      jti,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    await auditLog({ action: Actions.LOGIN_SUCCESS, actor: { emp_id: user.emp_id, email_id }, req });

    return ok(res, {
      accessToken,
      refreshToken,
      user: { emp_id: user.emp_id, email_id: user.email_id }
    });
  } catch (err) {
    await errorLog({ err, req, context: { email_id } });
    return serverError(res);
  }
}

/**
 * Logout controller
 */
async function logout(req, res) {
  try {
    if (req.user?.jti) await deactivateSession(req.user.jti);

    await auditLog({
      action: Actions.LOGOUT,
      actor: { emp_id: req.user?.emp_id, email_id: req.user?.email_id },
      req
    });

    return ok(res, { message: 'Logged out' });
  } catch (err) {
    await errorLog({ err, req, context: { emp_id: req.user?.emp_id } });
    return serverError(res);
  }
}

/**
 * Refresh controller
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return badRequest(res, 'refreshToken required');

  try {
    const decoded = jwt.verify(refreshToken, env.jwt.secret, { issuer: env.jwt.issuer });
    const session = await findActiveSession(decoded.emp_id);

    if (!session || session.jti !== decoded.jti) {
      await auditLog({ action: Actions.JWT_INVALID, actor: { emp_id: decoded.emp_id }, req, meta: { reason: 'session_mismatch' } });
      return unauthorized(res, 'Session expired');
    }

    const newAccessToken = signToken({ emp_id: decoded.emp_id, jti: decoded.jti }, env.jwt.expiry);

    await auditLog({ action: Actions.JWT_VALIDATED, actor: { emp_id: decoded.emp_id }, req, meta: { jti: decoded.jti } });

    return ok(res, { accessToken: newAccessToken });
  } catch (err) {
    await errorLog({ err, req });
    await auditLog({ action: Actions.JWT_INVALID, actor: { email_id: req.body?.email_id }, req, meta: { reason: 'invalid_refresh_token' } });
    return unauthorized(res, 'Invalid refresh token');
  }
}

module.exports = {
  login,
  logout,
  refresh
};
