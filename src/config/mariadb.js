// config/mariadb.js
const mysql = require('mysql2/promise');
const { env } = require('./env.js');

// create pool ONCE (no async wrapper)
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
});

module.exports = {
  mariadb: pool
};

//---------------------
//sir's  code
// // config/mariadb.js
// const mysql = require('mysql2/promise');
// const { env } = require('./env.js');

// async function initMariadb() {
//   const pool = await mysql.createPool({
//     host: env.db.host,
//     port: env.db.port,
//     user: env.db.user,
//     password: env.db.pass,
//     database: env.db.name,
//     connectionLimit: 10,
//     waitForConnections: true,
//     queueLimit: 0,
//     enableKeepAlive: true,
//   });

//   return pool;
// }

// // Export a promise that resolves to the pool
// module.exports = {
//   mariadb: initMariadb()
// };



/* MariaDB client commands
Run the MariaDB client
Use the mariadb or mysql command:

bash
mariadb -u root -p
or (depending on your installation):

bash
mysql -u root -p
-u root → login as the root user

-p → prompt for password

After entering your password, you’ll be inside the MariaDB shell.

>> Common client commands
Inside the client:

sql
SHOW DATABASES;
USE my_database;
SHOW TABLES;
SELECT * FROM users;
Exit the client:

sql
exit;

>> Connect to a remote MariaDB server
bash
mariadb -h your-server-host -u your-username -p

>> Create DB User

CREATE USER 'attendance_user'@'localhost' IDENTIFIED BY 'attendance*2025';

GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost';

FLUSH PRIVILEGES;

>> Show grants

SHOW GRANTS FOR 'attendance_user'@'localhost';

OUTPUT:  
 GRANT USAGE ON *.* TO `attendance_user`@`localhost` IDENTIFIED BY PASSWORD '*89D067D3EF015978F2EDDE09FFB5E19A91A50356' 
 GRANT ALL PRIVILEGES ON `attendance_db`.* TO `attendance_user`@`localhost`


>> Test connection manually:

mariadb -u attendance_user -p attendance*2025

*/