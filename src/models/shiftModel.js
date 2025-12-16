import { mariadb } from '../config/mariadb.js';

export async function createShiftMaster(data) {
  const {
    shift_id, emp_id, shift_name, shift_start_time, shift_end_time
  } = data;

  const [result] = await mariadb.execute(
    `INSERT INTO shift_master (
      shift_id, emp_id, shift_name, shift_start_time, shift_end_time
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      shift_id, emp_id, shift_name, shift_start_time, shift_end_time
    ]
  );
  return result;
}

export async function getShiftMaster() {
  const [rows] = await mariadb.execute('SELECT * FROM shift_master');
  return rows;
}

export async function getShiftMasterById(shift_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM shift_master WHERE shift_id = ? LIMIT 1',
    [shift_id]
  );
  return rows[0] || null;
}

export async function updateShiftMaster(shift_id, data) {
 const {
     emp_id = null, shift_name = null, shift_start_time = null, shift_end_time = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE shift_master SET
    emp_id = ?, shift_name = ?, shift_start_time = ?, shift_end_time = ?
    WHERE shift_id = ?`,
    [
      emp_id, shift_name, shift_start_time, shift_end_time,
      shift_id
    ]
  );
  return result;
}

export async function deleteShiftMaster(shift_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM shift_master WHERE shift_id = ?',
    [shift_id]
  );
  return result;
}
