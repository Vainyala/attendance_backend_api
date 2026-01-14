const { mariadb } = require('../config/mariadb.js');

/**
 * Insert mapping
 */
async function createEmpMappedShiftModel(data) {
  const { emp_id, shift_id } = data;

  if (!emp_id || !shift_id) {
    throw new Error('emp_id or shift_id missing');
  }

  const [result] = await mariadb.execute(
    `
    INSERT INTO employee_mapped_shifts
    (emp_id, shift_id)
    VALUES (?, ?)`,
    [emp_id, shift_id]
  );
  return result;
}

/**
 * List all mappings
 */

async function listEmpMappedShiftModel() {
  const [rows] = await mariadb.execute(
    `SELECT * FROM employee_mapped_shifts`
  );

  return rows;
}

/**
 * Get active projects by employee ID (JOIN)
 */
async function getEmpMappedShiftModel(emp_id) {
  const [rows] = await mariadb.execute(
    `
    SELECT 
      ems.emp_id,
      s.shift_id,
      s.org_short_name,
      s.shift_name,
      s.shift_start_time,
      s.shift_end_time,
      ems.created_at,
      ems.updated_at
    FROM employee_mapped_shifts ems
    JOIN shift_master s 
      ON ems.shift_id = s.shift_id
    WHERE ems.emp_id = ?
    `,
    [emp_id]
  );

  return rows;
}


module.exports = {
  createEmpMappedShiftModel,
  listEmpMappedShiftModel,
  getEmpMappedShiftModel,
}