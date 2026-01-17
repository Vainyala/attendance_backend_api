// src/models/usersModel.js
const { mariadb } = require ( '../config/mariadb.js' );


/**
 * Get all users
 */
async function getAllUsers() {
  const [rows] = await mariadb.execute(
    `SELECT emp_id, email_id, emp_status, created_at, updated_at
     FROM users`
  );
  return rows;
}

/**
 * Create a new user
 */
async function createUser({ emp_id, email_id, password, mpin }) {
  const [result] = await mariadb.execute(
    `INSERT INTO users (emp_id, email_id, password, mpin)
     VALUES (?, ?, ?, ?)`,
    [emp_id, email_id, password, mpin || null]
  );
  return result;
}

/**
 * Update user by emp_id
 */
async function updateUser(emp_id, { email_id, password, mpin, emp_status }) {
  const [result] = await mariadb.execute(
    `UPDATE users
     SET email_id = COALESCE(?, email_id),
         password = COALESCE(?, password),
         mpin = COALESCE(?, mpin),
         emp_status = COALESCE(?, emp_status),
         updated_at = CURRENT_TIMESTAMP
     WHERE emp_id = ?`,
    [email_id, password, mpin, emp_status, emp_id]
  );
  return result;
}


/**
 * Partially Update user by emp_id 
 */
async function updateUserPartially(emp_id, { email_id, password, mpin, emp_status }) {
  const [result] = await mariadb.execute(
    `
    UPDATE users
    SET
      email_id   = COALESCE(?, email_id),
      password   = COALESCE(?, password),
      mpin       = COALESCE(?, mpin),
      emp_status = COALESCE(?, emp_status),
      updated_at = CURRENT_TIMESTAMP
    WHERE emp_id = ?
    `,
    [email_id, password, mpin, emp_status, emp_id]
  );

  return result;
}



/**
 * Delete user by emp_id
 */
async function deleteUser(emp_id) {
  const [result] = await mariadb.execute(
    `DELETE FROM users WHERE emp_id = ?`,
    [emp_id]
  );
  return result;
}

/**
 * Update password only
 */
async function updatePassword(emp_id, passwordHash) {
  await mariadb.execute(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE emp_id = ?',
    [passwordHash, emp_id]
  );
}

/**
 * Status helper
 */
function isActive(status) {
  return status === 'Active';
}


module.exports = {
  updatePassword,
  isActive,
  deleteUser,
  updateUser,
  updateUserPartially,
  createUser,
  getAllUsers
}