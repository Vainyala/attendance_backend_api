// src/middleware/jwtAuth.js
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { unauthorized, forbidden } from '../utils/response.js';

export function signToken(payload, expiry = env.jwt.expiry) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: expiry,
    issuer: env.jwt.issuer
  });
}

export function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return unauthorized(res, 'Missing or invalid Authorization header');
  }
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, env.jwt.secret, { issuer: env.jwt.issuer });
    req.user = decoded; // { emp_id, jti }
    return next();
  } catch (e) {
    return forbidden(res, 'Invalid or expired token');
  }
}
