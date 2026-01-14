const { mariadb } = require('../config/mariadb.js');

async function createTasks(connection, data) {
    const { task_id, project_id, emp_id, task_name,
            task_type, task_priority, task_status,
            task_est_end_date, task_est_effort_hrs,
            task_notes, task_description,
            task_deliverables, task_billable,
            attached_files } = data;

    const [result] = await connection.query(
        `INSERT INTO employee_timesheet (
    task_id, project_id, emp_id, task_name,
            task_type, task_priority, task_status,
            task_est_end_date, task_est_effort_hrs,
            task_notes, task_description,
            task_deliverables, task_billable,
            attached_files
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
           task_id, project_id, emp_id, task_name,
            task_type, task_priority, task_status,
            task_est_end_date, task_est_effort_hrs,
            task_notes, task_description,
            task_deliverables, task_billable,
            attached_files
        ]
    );
    return result;
}

async function getTasks() {
    const [rows] = await mariadb.execute('SELECT * FROM employee_timesheet');
    return rows;
}

async function getTasksById(task_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_timesheet WHERE task_id = ? LIMIT 1',
        [task_id]
    );
    return rows[0] || null;
}

async function getTasksByEmpId(emp_id) {
    const [rows] = await mariadb.execute(
        'SELECT * FROM employee_timesheet WHERE emp_id = ? LIMIT 1',
        [emp_id]
    );
    return rows[0] || null;
}

async function updateTasks(task_id, data) {
    const {
       task_name,
        task_priority,
        task_status,
        task_actual_end_date,
        task_actual_effort_hrs,
        task_description,
        task_notes,
        task_deliverables,
        task_history,
        task_billable,
        attached_files
    } = data;

    const [result] = await mariadb.execute(
        `UPDATE employee_timesheet SET
            task_name = ?,
            task_priority = ?,
            task_status = ?,
            task_actual_end_date = ?,
            task_actual_effort_hrs = ?,
            task_description = ?,
            task_notes = ?,
            task_deliverables = ?,
            task_history = ?,
            task_billable = ?,
            attached_files = ?
        WHERE task_id = ?`,
        [
             task_name,
            task_priority,
            task_status,
            task_actual_end_date,
            task_actual_effort_hrs,
            task_description,
            task_notes,
            task_deliverables,
            task_history,
            task_billable,
            attached_files,
            task_id
        ]
    );
    return result;
}

async function updateTasksPartially(task_id, data) {
    const {
        task_name = null,
        task_priority = null,
        task_status = null,
        task_actual_end_date = null,
        task_actual_effort_hrs = null,
        task_description = null,
        task_notes = null,
        task_deliverables = null,
        task_history = null,
        task_billable = null,
        attached_files = null
    } = data;

    const [result] = await mariadb.execute(
        `UPDATE employee_timesheet SET
            task_name = COALESCE(?, task_name),
            task_priority = COALESCE(?, task_priority),
            task_status = COALESCE(?, task_status),
            task_actual_end_date = COALESCE(?, task_actual_end_date),
            task_actual_effort_hrs = COALESCE(?, task_actual_effort_hrs),
            task_description = COALESCE(?, task_description),
            task_notes = COALESCE(?, task_notes),
            task_deliverables = COALESCE(?, task_deliverables),
            task_history = COALESCE(?, task_history),
            task_billable = COALESCE(?, task_billable),
            attached_files = COALESCE(?, attached_files)
        WHERE task_id = ?`,
        [
            task_name,
            task_priority,
            task_status,
            task_actual_end_date,
            task_actual_effort_hrs,
            task_description,
            task_notes,
            task_deliverables,
            task_history,
            task_billable,
            attached_files,
            task_id
        ]
    );

    return result;
}

async function deleteTasks(task_id) {
    const [result] = await mariadb.execute(
        'DELETE FROM employee_timesheet WHERE task_id = ?',
        [task_id]
    );
    return result;
}

module.exports = {
    createTasks,
    getTasks,
    getTasksById,
    getTasksByEmpId,
    updateTasks,
    updateTasksPartially,
    deleteTasks
}