const { mariadb } = require( '../config/mariadb.js');

async function createLeaves(connection, data) {
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

async function getLeaves() {
    const [rows] = await mariadb.execute('SELECT * FROM employee_leaves');
    return rows;
}

async function getLeavesById(leave_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_leaves WHERE leave_id = ? LIMIT 1',
        [leave_id]
    );
    return rows[0] || null;
}

async function getLeavesByEmpId(emp_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_leaves WHERE emp_id = ? LIMIT 1',
        [emp_id]
    );
    return rows[0] || null;
}

async function updateLeaves(leave_id, data) {
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

async function updateLeavesPartially(leave_id, data) {
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
async function deleteLeaves(leave_id) {
    const [result] = await mariadb.execute(
        'DELETE FROM employee_leaves WHERE leave_id = ?',
        [leave_id]
    );
    return result;
}

module.exports = {
createLeaves,
getLeaves,
getLeavesByEmpId,
updateLeaves,
updateLeavesPartially,
deleteLeaves
}