/*
// error_logs
{
  "ts": "2025-12-12T08:55:05.456Z",
  "level": "ERROR",
  "name": "AuthError",
  "message": "Invalid credentials",
  "stack": "Error: AuthError\n    at ...",
  "req": {
    "reqId": "c3b...f1",
    "path": "/api/v1/auth/login",
    "method": "POST"
  },
  "context": { "email_id": "user@org.in" }
}

*/

import { mongo } from '../config/mongodb.js';
import { nowISO } from '../utils/time.js';

export async function errorLog({ err, req, context = {}, level = 'ERROR' }) {
  try {
    await mongo.errors.insertOne({
      ts: nowISO(),
      level,
      name: err.name || 'Error',
      message: err.message || String(err),
      stack: err.stack,
      req: { reqId: req.reqId, path: req.path, method: req.method },
      context,
    });
  } catch (_) {
    // fail-silent
  }
}
