const { createTasks, getTasks,
    getTasksById, getTasksByEmpId,
    updateTasks, updateTasksPartially,
    deleteTasks } = require('../models/timesheetModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { mariadb } = require('../config/mariadb.js');
const { getOrgShortNameFromEmp } = require('../utils/getOrgShortNameFromEmp.js')
const SerialNumberGenerator = require('../utils/serialGenerator.js');
/*
POST {{base_url}}/api/v1/tasks
Authorization: Bearer {{access_token}}

{
  "task_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "leave_from_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Heavy Rain",
  "reg_approval_status": "REJECTED"
}
*/


async function create_task(req, res) {
    const connection = await mariadb.getConnection();

    let task_id = null;   // ✅ DEFINE HERE

    console.log('req.body:', req.body);

    try {
        await connection.beginTransaction();

        const { project_id, emp_id, task_name,
            task_type, task_priority, task_status,
            task_est_end_date, task_est_effort_hrs,
            task_notes, task_description,
            task_deliverables, task_billable,
            attached_files } = req.body;

        if (!emp_id || !project_id) {
            await connection.rollback();
            return badRequest(res, 'emp_id and project_id is required');
        }

        // ✅ FIX 1 USED HERE
        const org_short_name = await getOrgShortNameFromEmp(connection, emp_id);

        task_id = await SerialNumberGenerator.generateSerialNumber(
            org_short_name,
            'timesheet',
            connection
        );

        await createTasks(connection, {
            task_id, project_id, emp_id, task_name,
            task_type, task_priority, task_status,
            task_est_end_date, task_est_effort_hrs,
            task_notes, task_description,
            task_deliverables, task_billable,
            attached_files
        });


        await auditLog({
            action: 'employee_task_create',
            actor: { emp_id },
            req,
            meta: { task_id }
        });

        await connection.commit();

        return ok(res, {
            message: 'Employee Tasks created successfully',
            data: { task_id }
        });

    } catch (err) {
        await connection.rollback();
        console.log('error:', err);

        // ✅ task_id now SAFE
        await errorLog({ err, req, context: { task_id } });

        return serverError(res);
    } finally {

        connection.release();
        console.log('Conncection is released...');
    }
}


/*
GET {{base_url}}/api/v1/tasks
Authorization: Bearer {{access_token}}

*/
async function list_task(req, res) {
    try {
        const reg = await getTasks();
        return ok(res, reg);
    } catch (err) {
        await errorLog({ err, req });
        return serverError(res);
    }
}

/*
GET {{base_url}}/api/v1/tasks/REG2025120003
Authorization: Bearer {{access_token}}

*/
async function get_task(req, res) {
    const { task_id } = req.params;
    console.log('Body:', req.params);
    try {
        const task = await getTasksById(task_id);
        if (!task) return notFound(res, 'Employee Tasks not found');
        return ok(res, task);
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { task_id } });
        return serverError(res);
    }
}


async function get_taskByEmpId(req, res) {
    const { emp_id, project_id } = req.params;
    console.log('Body:', req.params);
    try {
        const tasks = await getTasksByEmpId(emp_id);
        if (!tasks) return notFound(res, 'Employee not found');
        return ok(res, tasks);
    } catch (err) {
        console.log('error:', err);
        await errorLog({ err, req, context: { task_id, emp_id, project_id } });
        return serverError(res);
    }
}
/*
PUT {{base_url}}/api/v1/tasks/REG2025120003
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do

{
  "task_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "leave_from_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Traffic", 
  "reg_approval_status": "REJECTED"
}


*/
async function update_task(req, res) {
    const { task_id } = req.params;   // ✅ CORRECT

    console.log('update body:', req.body);
    try {
        await updateTasks(task_id, req.body);
        await auditLog({
            action: 'employee_task_update', actor: {
                task_id: req.user?.task_id

            }, req, meta: { task_id }
        });
        return ok(res, { message: 'Employee Tasks updated successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { task_id } });
        return serverError(res);
    }
}

/*
PATCH {{base_url}}/api/v1/tasks/NUTANTEKT202611
Authorization: Bearer {{access_token}}
into this can update one or all field can change
{
   "task_description": "use flutter",
}

*/
async function update_taskPartially(req, res) {
    const { task_id } = req.params;
    console.log('body:', req.body)

    try {
        await updateTasksPartially(task_id, req.body);
        await auditLog({
            action: 'employee_task_update', actor: {
                task_id: req.user?.task_id

            }, req, meta: { task_id }
        });
        return ok(res, { message: 'Employee Tasks  updated successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { task_id } });
        return serverError(res);
    }
}

/*
DELETE {{base_url}}/api/v1/tasks/NUTANTEKT202611
Authorization: Bearer {{access_token}}

*/
async function delete_task(req, res) {
    const { task_id } = req.params;
    try {
        await deleteTasks(task_id);
        await auditLog({
            action: 'employee_task_delete', actor: {
                task_id: req.user?.task_id

            }, req, meta: { task_id }
        });
        return ok(res, { message: 'Employee Tasks deleted successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { task_id } });
        return serverError(res);
    }
}


module.exports = {
    get_task,
    create_task,
    list_task,
    get_taskByEmpId,
    update_task,
    update_taskPartially,
    delete_task
}