import { mongo } from '../config/mongodb.js';

const sessions = mongo.db.collection('sessions');

export async function findActiveSession(emp_id) {
  return await sessions.findOne({ emp_id, status: 'ACTIVE' });
}

export async function createSession({ emp_id, email_id, jti, refreshToken, expiresAt }) {
  return await sessions.insertOne({
    emp_id,
    email_id,
    jti,
    status: 'ACTIVE',
    issued_at: new Date().toISOString(),
    expires_at: expiresAt,
    refresh_token: refreshToken
  });
}

export async function deactivateSession(jti) {
  return await sessions.updateOne({ jti }, { $set: { status: 'INACTIVE' } });
}

/*
// sessions document shape
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