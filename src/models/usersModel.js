// src/models/usersModel.js
const { mariadb } = require('../config/mariadb.js');

async function findUserByEmail(email) {
  const [rows] = await mariadb.execute(
    'SELECT emp_id, email_id, password, emp_status FROM users WHERE email_id = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function updatePassword(emp_id, passwordHash) {
  await mariadb.execute(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE emp_id = ?',
    [passwordHash, emp_id]
  );
}

function isActive(status) {
  return status === 'Active';
}

module.exports = {
  findUserByEmail,
  updatePassword,
  isActive
};




//sir's code
// // src/models/usersModel.js
// const { mariadb } = require('../config/mariadb.js');

// async function findUserByEmail(email) {
//   const pool = await mariadb; // mariadb is exported as a promise
//   const [rows] = await pool.execute(
//     'SELECT emp_id, email_id, password, emp_status FROM users WHERE email_id = ? LIMIT 1',
//     [email]
//   );
//   return rows[0] || null;
// }

// async function updatePassword(emp_id, passwordHash) {
//   const pool = await mariadb;
//   await pool.execute(
//     'UPDATE users SET password = ?, updated_at = NOW() WHERE emp_id = ?',
//     [passwordHash, emp_id]
//   );
// }

// function isActive(status) {
//   return status === 'Active';
// }

// module.exports = {
//   findUserByEmail,
//   updatePassword,
//   isActive
// };
