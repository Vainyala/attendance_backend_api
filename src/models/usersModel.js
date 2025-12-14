// src/models/usersModel.js
import { mariadb } from '../config/mariadb.js';

export async function findUserByEmail(email) {
  const [rows] = await mariadb.execute(
    'SELECT emp_id, email_id, password, emp_status FROM users WHERE email_id = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function updatePassword(emp_id, passwordHash) {
  await mariadb.execute(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE emp_id = ?',
    [passwordHash, emp_id]
  );
}

export function isActive(status) {
  return status === 'ACTIVE';
}
