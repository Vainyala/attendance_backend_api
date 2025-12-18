import { mariadb } from '../config/mariadb.js';

export async function createAttendance(connection, data) {
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

export async function getAttendance() {
  const [rows] = await mariadb.execute('SELECT * FROM employee_attendance');
  return rows;
}

export async function getAttendanceById(att_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_attendance WHERE att_id = ? LIMIT 1',
    [att_id]
  );
  return rows[0] || null;
}

export async function getAttendanceByEmpId(emp_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_attendance WHERE emp_id = ? LIMIT 1',
    [emp_id]
  );
  return rows[0] || null;
}

export async function getAttendanceByDateRange(from_date, to_date) {
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

