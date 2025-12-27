// src/controllers/authController.js
import { verifyPassword } from '../utils/password.js';
import { ok, badRequest, unauthorized, serverError } from '../utils/response.js';
import { findUserByEmail, isActive } from '../models/usersModel.js';
import { signToken } from '../middleware/jwtAuth.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';
import { findActiveSession, createSession, deactivateSession } from '../models/sessionModel.js';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export async function login(req, res) {
  const { email_id, password } = req.body || {};
  console.log("body:",req.body);
  if (!email_id || !password) return badRequest(res, 'email_id and password are required', 'VALIDATION');

  try {
    const user = await findUserByEmail(email_id);
    if (!user || !isActive(user.emp_status)) return unauthorized(res, 'Invalid credentials');

    const match = await verifyPassword(password, user.password);
    if (!match) return unauthorized(res, 'Invalid credentials');

    // Prevent multiple logins
    const activeSession = await findActiveSession(user.emp_id);
    if (activeSession) return unauthorized(res, 'User already logged in');

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

    //await auditLog({ action: 'login_success', actor: { emp_id: user.emp_id, email_id }, req });

    return ok(res, { accessToken, refreshToken, user: { emp_id: user.emp_id, email_id: user.email_id } });
  } catch (err) {
    //await errorLog({ err, req, context: { email_id } });
    console.log('error:', err);
    return serverError(res);
  }
}

export async function logout(req, res) {
  try {
    if (req.user?.jti) await deactivateSession(req.user.jti);
    await auditLog({ action: 'logout', actor: { emp_id: req.user?.emp_id, email_id: req.user?.email_id }, req });
    return ok(res, { message: 'Logged out' });
  } catch (err) {
    await errorLog({ err, req, context: { emp_id: req.user?.emp_id } });
    return serverError(res);
  }
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return badRequest(res, 'refreshToken required');

  try {
    const decoded = jwt.verify(refreshToken, env.jwt.secret, { issuer: env.jwt.issuer });
    const session = await findActiveSession(decoded.emp_id);
    if (!session || session.jti !== decoded.jti) return unauthorized(res, 'Session expired');

    const newAccessToken = signToken({ emp_id: decoded.emp_id, jti: decoded.jti }, env.jwt.expiry);
    return ok(res, { accessToken: newAccessToken });
  } catch (err) {
    await errorLog({ err, req });
    return unauthorized(res, 'Invalid refresh token');
  }
}
