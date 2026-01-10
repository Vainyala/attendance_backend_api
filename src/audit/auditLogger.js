/*
// audit_logs
{
  "ts": "2025-12-12T08:55:00.123Z",
  "actor": { "emp_id": "EMP001", "email_id": "user@org.in" },
  "action": "login_success",
  "ip": "203.0.113.10",
  "ua": "PostmanRuntime/7.37.0",
  "reqId": "c3b...f1",
  "meta": { "issuer": "attendancebackend", "method": "password" }
}

*/

// src/audit/auditLogger.js
const { mongo } = require('../config/mongodb.js');
const { nowISO } = require('../utils/time.js');

async function auditLog({ action, actor, req, meta = {} }) {
  try {
    const mongoConn = await mongo; // mongo is a promise
    await mongoConn.audit.insertOne({
      ts: nowISO(),
      action,
      actor,
      ip: req.clientIp,
      ua: req.userAgent,
      reqId: req.reqId,
      meta,
    });
  } catch (_) {
    // fail-silent to avoid blocking core flow
  }
}

module.exports = { auditLog };
