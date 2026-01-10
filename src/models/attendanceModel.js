const { mariadb } = require('../config/mariadb.js');

async function createAttendance(connection, data) {
  const {
    att_id, emp_id,  att_latitude, att_longitude,
    att_geofence_name, project_id, att_notes, att_status, verification_type,
    is_verified
  } = data;

  const [result] = await connection.query(
    `INSERT INTO employee_attendance (
      att_id, emp_id, att_latitude, att_longitude,
    att_geofence_name, project_id, att_notes, att_status, verification_type,
    is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    
    [
      att_id, emp_id, att_latitude, att_longitude,
    att_geofence_name, project_id, att_notes, att_status, verification_type,
    is_verified
    ]
  );
  return result;
}

async function getAttendance() {
  const [rows] = await mariadb.execute('SELECT * FROM employee_attendance');
  return rows;
}


async function getAttendanceByEmpId(emp_id) {
  const [rows] = await mariadb.execute(
    `
    SELECT *
    FROM employee_attendance
    WHERE emp_id = ?
    ORDER BY att_timestamp DESC
    `,
    [emp_id]
  );
  return rows;
}


async function getAttendanceById(att_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_attendance WHERE att_id = ? LIMIT 1',
    [att_id]
  );
  return rows[0] || null;
}

async function getAttendanceByDateRange(from_date, to_date) {
  const [rows] = await mariadb.execute(
    `
    SELECT *
    FROM employee_attendance
    WHERE created_at BETWEEN ? AND ?
    ORDER BY created_at ASC
    `,
    [
      `${from_date} 00:00:00`,
      `${to_date} 23:59:59`
    ]
  );

  return rows;
}

async function getAttendanceWithSiteById(att_id) {
  const [rows] = await mariadb.execute(
    `
    SELECT 
      ea.*,
      psm.project_site_name,
      psm.project_site_lat,
      psm.project_site_long
    FROM employee_attendance ea
    LEFT JOIN project_site_mapping psm
      ON ea.project_id = psm.project_id
    WHERE ea.att_id = ?
    LIMIT 1
    `,
    [att_id]
  );

  return rows[0] || null;
}

module.exports = {
  createAttendance,
  getAttendance,
  getAttendanceByDateRange,
  getAttendanceByEmpId,
  getAttendanceById,
  getAttendanceWithSiteById
}