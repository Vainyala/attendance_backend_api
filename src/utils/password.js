// src/utils/password.js
const bcrypt = require('bcryptjs');

/**
 * Hash a plain text password
 * @param {string} password - plain text password
 * @param {number} saltRounds - cost factor (default 12)
 * @returns {Promise<string>} hashed password
 */
async function hashPassword(password, saltRounds = 12) {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a plain text password against a hash
 * @param {string} password - plain text password
 * @param {string} hash - stored bcrypt hash
 * @returns {Promise<boolean>} true if match
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
