// import {createTask,getTask,
//   getTaskById,getTaskByEmpId,
//   updateTask,updateTaskPartially,
//   deleteTask } from '../models/taskModel.js';
// import { ok, badRequest, notFound, serverError } from '../utils/response.js';
// import { auditLog } from '../audit/auditLogger.js';
// import { errorLog } from '../audit/errorLogger.js';
// import { mariadb } from '../config/mariadb.js';
// import { getOrgShortNameFromEmp } from '../utils/getOrgShortNameFromEmp.js'
// import SerialNumberGenerator from '../utils/serialGenerator.js';
// /*
// POST {{base_url}}/api/v1/regularization
// Authorization: Bearer {{access_token}}

// {
//   "task_id": "REG2025120003",
//   "emp_id": "NUTANTEKE20250600002",
//   "leave_from_date": "2025-12-05",
//   "shortfall_hrs": 9.00,
//   "reg_justification": "Heavy Rain",
//   "reg_approval_status": "REJECTED"
// }
// */


// export async function create_task(req, res) {
//  const pool = await mariadb;        // wait for the promise
//const connection = await pool.getConnection();

//   let task_id = null;   // ✅ DEFINE HERE

//   console.log('req.body:', req.body);

//   try {
//     await connection.beginTransaction();

//     const { emp_id, leave_from_date, leave_to_date, 
//         leave_type, leave_justification } = req.body;

//     if (!emp_id) {
//       await connection.rollback();
//       return badRequest(res, 'emp_id is required');
//     }

//     // ✅ FIX 1 USED HERE
//     const org_short_name = await getOrgShortNameFromEmp(connection, emp_id);

//     task_id = await SerialNumberGenerator.generateSerialNumber(
//       org_short_name,
//       'leave',
//       connection
//     );

//     //const
//   //  = await CalculateShortfallHrs.calculate(
//   //     connection,
//   //     emp_id,
//   //     leave_from_date
//   //   );

//     await createTask(connection, {
//       task_id,
//       emp_id,
//       leave_from_date,
//       leave_to_date,
//       leave_type,
//       leave_justification
//     });


//     await auditLog({
//       action: 'employee_task_create',
//       actor: { emp_id },
//       req,
//       meta: { task_id }
//     });

//     await connection.commit();

//     return ok(res, {
//       message: 'Employee Task created successfully',
//       data: { task_id }
//     });

//   } catch (err) {
//     await connection.rollback();
//     console.log('error:', err);

//     // ✅ task_id now SAFE
//     await errorLog({ err, req, context: { task_id } });

//     return serverError(res);
//   } finally {
    
//     connection.release();
//     console.log('Conncection is released...');
//   }
// }


// /*
// GET {{base_url}}/api/v1/regularization
// Authorization: Bearer {{access_token}}

// */
// export async function list_task(req, res) {
//   try {
//     const reg = await getTask();
//     return ok(res, reg);
//   } catch (err) {
//     console.log('error:', err);
//     await errorLog({ err, req });
//     return serverError(res);
//   }
// }

// /*
// GET {{base_url}}/api/v1/regularization/REG2025120003
// Authorization: Bearer {{access_token}}

// */
// export async function get_task(req, res) {
//   const { task_id } = req.params;
//   console.log('Body:', req.params);
//   try {
//     const task = await getTaskById(task_id);
//     if (!task) return notFound(res, 'Employee Task not found');
//     return ok(res, task);
//   } catch (err) {
//     console.log('error:', err);
//     await errorLog({ err, req, context: { task_id } });
//     return serverError(res);
//   }
// }


// export async function get_taskByEmpId(req, res) {
//   const { emp_id } = req.params;
//   console.log('Body:', req.params);
//   try {
//     const task = await getTaskByEmpId(emp_id);
//     if (!task) return notFound(res, 'Employee not found');
//     return ok(res, task);
//   } catch (err) {
//     console.log('error:', err);
//     await errorLog({ err, req, context: { task_id, emp_id } });
//     return serverError(res);
//   }
// }
// /*
// PUT {{base_url}}/api/v1/regularization/REG2025120003
// Authorization: Bearer {{access_token}}
// here should pass all fields names and into that update can do

// {
//   "task_id": "REG2025120003",
//   "emp_id": "NUTANTEKE20250600002",
//   "leave_from_date": "2025-12-05",
//   "shortfall_hrs": 9.00,
//   "reg_justification": "Traffic", 
//   "reg_approval_status": "REJECTED"
// }


// */
// export async function update_task(req, res) {
//   const { task_id } = req.params;   // ✅ CORRECT

//   console.log('update body:', req.body);
//   try {
//     await updateTask(task_id, req.body);
//     await auditLog({
//       action: 'employee_task_update', actor: {
//         task_id: req.user?.task_id

//       }, req, meta: { task_id }
//     });
//     return ok(res, { message: 'Employee Task updated successfully' });
//   } catch (err) {
//     console.log('error:', err)
//     await errorLog({ err, req, context: { task_id } });
//     return serverError(res);
//   }
// }

// /*
// PATCH {{base_url}}/api/v1/leaves/REG2025120003
// Authorization: Bearer {{access_token}}
// into this can update one or all field can change
// {
//    "reg_justification": "Heavy Rain",
// }

// */
// export async function update_taskPartially(req, res) {
//   const { task_id } = req.params;
//   console.log('body:', req.body)

//   try {
//     await updateTaskPartially(task_id, req.body);
//     await auditLog({
//       action: 'employee_task_update', actor: {
//         task_id: req.user?.task_id

//       }, req, meta: { task_id }
//     });
//     return ok(res, { message: 'Employee Task  updated successfully' });
//   } catch (err) {
//     console.log('error:', err)
//     await errorLog({ err, req, context: { task_id } });
//     return serverError(res);
//   }
// }

// /*
// DELETE {{base_url}}/api/v1/leaves/REG2025120003
// Authorization: Bearer {{access_token}}

// */
// export async function delete_task(req, res) {
//   const { task_id } = req.params;
//   try {
//     await deleteTask(task_id);
//     await auditLog({
//       action: 'employee_task_delete', actor: {
//         task_id: req.user?.task_id

//       }, req, meta: { task_id }
//     });
//     return ok(res, { message: 'Employee Task deleted successfully' });
//   } catch (err) {
//     console.log('error:', err)
//     await errorLog({ err, req, context: { task_id } });
//     return serverError(res);
//   }
// }
