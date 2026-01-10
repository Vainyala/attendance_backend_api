const { mariadb } = require('../config/mariadb.js');

async function createRegularization(connection, data) {
  const { reg_id, emp_id, reg_applied_for_date, reg_justification,  reg_first_check_in,
    reg_last_check_out,
    shortfall_hrs } = data;

  const [result] = await connection.query(
    `INSERT INTO employee_regularization (
      reg_id,  emp_id, reg_applied_for_date, reg_justification, reg_first_check_in,
      reg_last_check_out,shortfall_hrs
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [reg_id, emp_id, reg_applied_for_date, reg_justification, reg_first_check_in,
      reg_last_check_out, shortfall_hrs]
  );

  return result;
}

async function getRegularization() {
  const [rows] = await mariadb.execute('SELECT * FROM employee_regularization');
  return rows;
}

async function getRegularizationById(reg_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_regularization WHERE reg_id = ? LIMIT 1',
    [reg_id]
  );
  return rows[0] || null;
}

async function getRegularizationByEmpId(emp_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_regularization WHERE emp_id = ? LIMIT 1',
    [emp_id]
  );
  return rows[0] || null;
}

async function updateRegularization(reg_id, data) {
 const {
    emp_id = null,
    reg_applied_for_date = null,
    reg_justification = null,
    reg_approval_status = null,
    shortfall_hrs = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_regularization SET
      emp_id = ?, reg_applied_for_date = ?, reg_justification = ?, reg_approval_status = ?,
       shortfall_hrs = ?
    WHERE reg_id = ?`,
    [
      emp_id, reg_applied_for_date, reg_justification, reg_approval_status, 
    shortfall_hrs,
    reg_id
    ]
  );
  return result;
}

async function updateRegularizationPartially(reg_id, data) {
  const {
    emp_id = null,
    reg_applied_for_date = null,
    reg_justification = null,
    reg_approval_status = null,
    shortfall_hrs = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_regularization SET
      emp_id = COALESCE(?, emp_id),
      reg_applied_for_date = COALESCE(?, reg_applied_for_date),
      reg_justification = COALESCE(?, reg_justification),
      reg_approval_status = COALESCE(?, reg_approval_status),
      shortfall_hrs = COALESCE(?, shortfall_hrs)
     WHERE reg_id = ?`,
    [
         emp_id, reg_applied_for_date, reg_justification, reg_approval_status, 
    shortfall_hrs,
    reg_id
    ]
  );

  return result;
}

async function deleteRegularization(reg_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM employee_regularization WHERE reg_id = ?',
    [reg_id]
  );
  return result;
}

module.exports = {
  createRegularization,
  getRegularization,
  getRegularizationById,
  getRegularizationByEmpId,
  updateRegularization,
  updateRegularizationPartially,
  deleteRegularization
}