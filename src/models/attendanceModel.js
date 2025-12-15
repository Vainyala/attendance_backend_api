import { mariadb } from '../config/mariadb.js';

export async function createAttendance(data) {
  const {
    att_id, emp_id,  att_latitude, att_longitude,
    att_geofence_name, att_project_id, att_notes, att_status, verification_type,
    is_verified
  } = data;

  const [result] = await mariadb.execute(
    `INSERT INTO employee_attendance (
      att_id, emp_id, att_latitude, att_longitude,
    att_geofence_name, att_project_id, att_notes, att_status, verification_type,
    is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      att_id, emp_id, att_latitude, att_longitude,
    att_geofence_name, att_project_id, att_notes, att_status, verification_type,
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

// export async function updateAttendance(att_id, data) {
//   const {
//     emp_id = null,  att_latitude = null,  att_longitude = null,
//     att_geofence_name = null, att_project_id = null, att_notes = null, att_status = null,
//      verification_type = null ,is_verified = null
//   } = data;

//   const [result] = await mariadb.execute(
//     `UPDATE employee_attendance SET
//       emp_id = ?,  att_latitude = ?, att_longitude = ?,
//       att_geofence_name = ?, att_project_id = ?, att_notes = ?, att_status = ?,
//       verification_type = ?, is_verified = ?, updated_at = NOW()
//     WHERE att_id = ?`,
//     [
//       emp_id, att_latitude, att_longitude,
//     att_geofence_name, att_project_id, att_notes, att_status, verification_type,
//     is_verified,
//       att_id
//     ]
//   );
//   return result;
// }

// export async function updateAttendancePartially(att_id, data) {
//   const {
//     emp_id = null,  att_latitude = null,  att_longitude = null,
//     att_geofence_name = null, att_project_id = null, att_notes = null, att_status = null,
//      verification_type = null ,is_verified = null
//   } = data;

//   const [result] = await mariadb.execute(
//     `UPDATE employee_attendance SET
//       emp_id = COALESCE(?, emp_id),  
//       att_latitude = COALESCE(?, att_latitude), att_longitude = COALESCE(?, att_longitude),
//       att_geofence_name = COALESCE(?, att_geofence_name), att_project_id = COALESCE(?, att_project_id), 
//       att_notes = COALESCE(?, att_notes), att_status = COALESCE(?, att_status),
//       verification_type = COALESCE(?, verification_type), 
//       is_verified = COALESCE(?, is_verified), updated_at = NOW()
//     WHERE att_id = ?`,
//     [
//       emp_id, att_latitude, att_longitude,
//     att_geofence_name, att_project_id, att_notes, att_status, verification_type,
//     is_verified,
//       att_id
//     ]
//   );
//   return result;
// }


// export async function deleteAttendance(att_id) {
//   const [result] = await mariadb.execute(
//     'DELETE FROM employee_attendance WHERE att_id = ?',
//     [att_id]
//   );
//   return result;
// }
