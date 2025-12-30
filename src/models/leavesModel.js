import { mariadb } from '../config/mariadb.js';

// export async function createRegularization(data) {
//   const {
//    leave_id, org_short_name, mgr_id, reg_applied_for_date, reg_justification, reg_approval_status, 
//     shortfall_hrs,mgr_comments
//   } = data;

//   const [result] = await mariadb.execute(
//     `INSERT INTO employee_regularization (
//     leave_id,  org_short_name, mgr_id, reg_applied_for_date, reg_justification,reg_approval_status,
//      shortfall_hrs,mgr_comments
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//      leave_id, org_short_name, mgr_id, reg_applied_for_date, reg_justification, reg_approval_status, 
//     shortfall_hrs, mgr_comments
//     ]
//   );
//   return result;
// }


export async function createLeaves(connection, data) {
    const { leave_id, emp_id, leave_from_date,
        leave_to_date,
        leave_type,
        leave_justification } = data;

    const [result] = await connection.query(
        `INSERT INTO employee_leaves (
    leave_id, emp_id, leave_from_date,
    leave_to_date, leave_type, leave_justification
  ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            leave_id,
            emp_id,
            leave_from_date,
            leave_to_date,
            leave_type,
            leave_justification
        ]
    );


    return result;
}

export async function getLeaves() {
    const [rows] = await mariadb.execute('SELECT * FROM employee_leaves');
    return rows;
}

export async function getLeavesById(leave_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_leaves WHERE leave_id = ? LIMIT 1',
        [leave_id]
    );
    return rows[0] || null;
}

export async function getLeavesByEmpId(emp_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_leaves WHERE emp_id = ? LIMIT 1',
        [emp_id]
    );
    return rows[0] || null;
}

export async function updateLeaves(leave_id, data) {
    const {
        emp_id = null,
        leave_from_date = null,
        leave_to_date = null,
        leave_type = null,
        leave_justification = null
    } = data;

    const [result] = await mariadb.execute(
        `UPDATE employee_leaves SET
      emp_id = ?, leave_from_date = ?, leave_to_date = ?, leave_type = ?,
       leave_justification = ?
    WHERE leave_id = ?`,
        [
            emp_id, leave_from_date, leave_to_date,
            leave_type, leave_justification,
            leave_id
        ]
    );
    return result;
}

export async function updateLeavesPartially(leave_id, data) {
    const {
        emp_id = null,
        leave_from_date = null,
        leave_to_date = null,
        leave_type = null,
        leave_justification = null
    } = data;

    const [result] = await mariadb.execute(
        `UPDATE employee_leaves SET
      emp_id = COALESCE(?, emp_id),
      leave_from_date = COALESCE(?, leave_from_date),
      leave_to_date = COALESCE(?, leave_to_date),
      leave_type = COALESCE(?, leave_type),
      leave_justification = COALESCE(?, leave_justification)
     WHERE leave_id = ?`,
        [emp_id, leave_from_date, leave_to_date,
            leave_type, leave_justification,
            leave_id
        ]
    );

    return result;
}

export async function deleteLeaves(leave_id) {
    const [result] = await mariadb.execute(
        'DELETE FROM employee_leaves WHERE leave_id = ?',
        [leave_id]
    );
    return result;
}
