import { mariadb } from '../config/mariadb.js';

// export async function createRegularization(data) {
//   const {
//    reg_id, org_short_name, mgr_id, reg_applied_for_date, reg_justification, reg_approval_status, 
//     shortfall_hrs,mgr_comments
//   } = data;

//   const [result] = await mariadb.execute(
//     `INSERT INTO employee_regularization (
//     reg_id,  org_short_name, mgr_id, reg_applied_for_date, reg_justification,reg_approval_status,
//      shortfall_hrs,mgr_comments
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//      reg_id, org_short_name, mgr_id, reg_applied_for_date, reg_justification, reg_approval_status, 
//     shortfall_hrs, mgr_comments
//     ]
//   );
//   return result;
// }


export async function createRegularization(connection, data) {
  const { reg_id, org_short_name, emp_id, reg_applied_for_date, reg_justification, shortfall_hrs } = data;

  const [result] = await connection.query(
    `INSERT INTO employee_regularization (
      reg_id, org_short_name, emp_id, reg_applied_for_date, reg_justification, shortfall_hrs
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [reg_id, org_short_name, emp_id, reg_applied_for_date, reg_justification, shortfall_hrs]
  );

  return result;
}

export async function getRegularization() {
  const [rows] = await mariadb.execute('SELECT * FROM employee_regularization');
  return rows;
}

export async function getRegularizationById(reg_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_regularization WHERE reg_id = ? LIMIT 1',
    [reg_id]
  );
  return rows[0] || null;
}

export async function updateRegularization(reg_id, data) {
 const {
    org_short_name = null,
    emp_id = null,
    reg_applied_for_date = null,
    reg_justification = null,
    reg_approval_status = null,
    shortfall_hrs = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_regularization SET
      org_short_name = ?,emp_id = ?, reg_applied_for_date = ?, reg_justification = ?, reg_approval_status = ?,
       shortfall_hrs = ?
    WHERE reg_id = ?`,
    [
      org_short_name, emp_id, reg_applied_for_date, reg_justification, reg_approval_status, 
    shortfall_hrs,
    reg_id
    ]
  );
  return result;
}

export async function updateRegularizationPartially(reg_id, data) {
  const {
    org_short_name = null,
    emp_id = null,
    reg_applied_for_date = null,
    reg_justification = null,
    reg_approval_status = null,
    shortfall_hrs = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_regularization SET
      org_short_name = COALESCE(?, org_short_name),
      emp_id = COALESCE(?, emp_id),
      reg_applied_for_date = COALESCE(?, reg_applied_for_date),
      reg_justification = COALESCE(?, reg_justification),
      reg_approval_status = COALESCE(?, reg_approval_status),
      shortfall_hrs = COALESCE(?, shortfall_hrs)
     WHERE reg_id = ?`,
    [
        org_short_name, emp_id, reg_applied_for_date, reg_justification, reg_approval_status, 
    shortfall_hrs,
    reg_id
    ]
  );

  return result;
}

export async function deleteRegularization(reg_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM employee_regularization WHERE reg_id = ?',
    [reg_id]
  );
  return result;
}
