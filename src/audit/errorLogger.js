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

// src/audit/errorLogger.js
const { mongo } = require('../config/mongodb.js');
const { nowISO } = require('../utils/time.js');

async function errorLog({ err, req, context = {}, level = 'ERROR' }) {
  try {
    const mongoConn = await mongo; // mongo is a promise
    await mongoConn.errors.insertOne({
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

module.exports = { errorLog };
