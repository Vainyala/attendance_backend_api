// src/models/sessionModel.js
const { mongo } = require('../config/mongodb.js');

async function getSessionsCollection() {
  const mongoConn = await mongo; // mongo is a promise
  return mongoConn.db.collection('sessions');
}

async function findActiveSession(emp_id) {
  const sessions = await getSessionsCollection();
  return sessions.findOne({ emp_id, status: 'ACTIVE' });
}

async function createSession({ emp_id, email_id, jti, refreshToken, expiresAt }) {
  const sessions = await getSessionsCollection();
  return sessions.insertOne({
    emp_id,
    email_id,
    jti,
    status: 'ACTIVE',
    issued_at: new Date().toISOString(),
    expires_at: expiresAt,
    refresh_token: refreshToken
  });
}

async function deactivateSession(jti) {
  const sessions = await getSessionsCollection();
  return sessions.updateOne({ jti }, { $set: { status: 'INACTIVE' } });
}

/*
sessions document shape:
{
  "_id": "uuid-or-objectid",
  "emp_id": "EMP001",
  "email_id": "user@org.in",
  "jti": "randomUUID",        // JWT ID
  "status": "ACTIVE",         // ACTIVE | INACTIVE
  "issued_at": "2025-12-12T14:09:32.219Z",
  "expires_at": "2025-12-19T14:09:32.219Z",
  "refresh_token": "hashed-refresh-token"
}
*/

module.exports = {
  findActiveSession,
  createSession,
  deactivateSession
};

