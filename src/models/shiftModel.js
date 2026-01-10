const { mariadb } = require('../config/mariadb.js');

async function createShiftMaster(connection,data) {
  const {
    shift_id, org_short_name, shift_name, shift_start_time, shift_end_time
  } = data;

  const [result] = await connection.query(
    `INSERT INTO shift_master (
      shift_id, org_short_name, shift_name, shift_start_time, shift_end_time
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      shift_id, org_short_name, shift_name, shift_start_time, shift_end_time
    ]
  );
  return result;
}

async function getShiftMaster() {
  const [rows] = await mariadb.execute('SELECT * FROM shift_master');
  return rows;
}

async function getShiftMasterById(shift_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM shift_master WHERE shift_id = ? LIMIT 1',
    [shift_id]
  );
  return rows[0] || null;
}

async function updateShiftMaster(shift_id, data) {
  const {
    org_short_name = null, shift_name = null, shift_start_time = null, shift_end_time = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE shift_master SET
    org_short_name = ?, shift_name = ?, shift_start_time = ?, shift_end_time = ?
    WHERE shift_id = ?`,
    [
      org_short_name, shift_name, shift_start_time, shift_end_time,
      shift_id
    ]
  );
  return result;
}

async function deleteShiftMaster(shift_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM shift_master WHERE shift_id = ?',
    [shift_id]
  );
  return result;
}

module.exports = {
  createShiftMaster,
  getShiftMaster,
  getShiftMasterById,
  updateShiftMaster,
  deleteShiftMaster
}