const { ok, serverError } = require('../utils/response.js');
const { mariadb } = require('../config/mariadb.js');
const { mongo } = require('../config/mongodb.js');


/*
End Point:
{
  "name": "Health Check",
  "request": {
    "method": "GET",
    "url": {
      "raw": "{{base_url}}/api/v1/health",
      "host": ["{{base_url}}"],
      "path": ["api", "v1", "health"]
    }
  }
}


When everything is healthy , then send JSON response:

{
  "service": "attendancebackend",
  "timestamp": "2025-12-12T18:30:00.000Z",
  "mariadb": "UP",
  "mongodb": "UP"
}


// If MariaDB/MongoDB is health:-

{
  "service": "attendancebackend",
  "timestamp": "2025-12-12T18:30:00.000Z",
  "mariadb": "UP",
  "mongodb": "DOWN",
  "mongodb_error": "connect ECONNREFUSED 127.0.0.1:27017"
}


*/
async function healthCheck(req, res) {
  try {
    const status = { service: 'attendancebackend', timestamp: new Date().toISOString() };

    // Check MariaDB
    try {
      await mariadb.execute('SELECT 1');
      status.mariadb = 'UP';
    } catch (err) {
      status.mariadb = 'DOWN';
      status.mariadb_error = err.message;
    }

    // Check MongoDB
    try {
      await mongo.db.command({ ping: 1 });
      status.mongodb = 'UP';
    } catch (err) {
      status.mongodb = 'DOWN';
      status.mongodb_error = err.message;
    }

    return ok(res, status);
  } catch (err) {
    return serverError(res);
  }
}


module.exports = {healthCheck};