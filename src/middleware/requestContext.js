// src/middleware/requestContext.js
const { randomUUID } = require('crypto');

function requestContext(req, _res, next) {
  req.reqId = randomUUID();
  req.clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket.remoteAddress;
  req.userAgent = req.headers['user-agent'] || 'unknown';
  next();
}

module.exports = { requestContext };
