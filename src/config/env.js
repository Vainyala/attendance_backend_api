// config/env.js
require('dotenv/config');

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'attendancebackend_dev',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY || '1h',
    issuer: process.env.JWT_ISSUER || 'attendancebackend',
  },
};

module.exports = { env };