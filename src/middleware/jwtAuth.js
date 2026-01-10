// src/middleware/jwtAuth.js
const jwt = require('jsonwebtoken');
const { env } = require('../config/env.js');
const { unauthorized, forbidden } = require('../utils/response.js');
const { errorLog } = require('../audit/errorLogger.js');
const { auditLog } = require('../audit/auditLogger.js');

function signToken(payload, expiry = env.jwt.expiry) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: expiry,
    issuer: env.jwt.issuer
  });
}

async function jwtAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) {
    await errorLog({
      err: new Error('Missing or invalid Authorization header'),
      req,
      context: { header: auth }
    });
    return unauthorized(res, 'Missing or invalid Authorization header');
  }

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, env.jwt.secret, { issuer: env.jwt.issuer });
    req.user = decoded; // { emp_id, jti }

    // ✅ Log successful validation
    await auditLog({
      action: 'jwt_validated',
      actor: { emp_id: decoded.emp_id },
      req,
      meta: { jti: decoded.jti }
    });

    return next();
  } catch (e) {
    await errorLog({
      err: e,
      req,
      context: { tokenSnippet: token.substring(0, 12) + '...' }
    });
    return forbidden(res, 'Invalid or expired token');
  }
}

module.exports = {
  signToken,
  jwtAuth
};
