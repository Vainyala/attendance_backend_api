import {
  createEmployee,
  getEmployee,
  getEmployeeById,
  updateEmployee,
  updateEmployeePartial,
  deleteEmployee
} from '../models/employeeModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

/*
POST {{base_url}}/api/v1/employee
Authorization: Bearer {{access_token}}
{
  "emp_id": "EMP001",
  "emp_name": "Vainyala Samal",
  "emp_role": "App Developer",
  "emp_department": "IT",
  "emp_phone": "9767731178"
}

*/
export async function createEmp(req, res) {
  console.log('req.body:', req.body);
  const { emp_id, emp_name } = req.body || {};
  if (!emp_id || !emp_name) return badRequest(res, 'emp_id and emp_name are required', 'VALIDATION');

  try {
    await createEmployee(req.body);
    await auditLog({ action: 'employee_create', actor: { emp_id: req.user?.emp_id }, req, meta: { emp_id, emp_name } });
    return ok(res, { message: 'Employee created successfully' });
  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/employee
Authorization: Bearer {{access_token}}

*/
export async function listEmp(req, res) {
  try {
    const emp = await getEmployee();
    return ok(res, emp);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}

*/
export async function getEmp(req, res) {
  const { emp_id } = req.params;
  try {
    const emp = await getEmployeeById(emp_id);
    if (!emp) return notFound(res, 'Employee not found');
    return ok(res, emp);
  } catch (err) {
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
PUT {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do
{
  "org_id" : "ORG002",
  "emp_name": "Samal Vainyala", (like Samal Vainyala to Vainyala)
  "emp_email": "vainyala17@nutantek.com",
  "emp_role": "Flutter Developer",
  "emp_department": "App Development dept.",
  "emp_phone" : "9767731178",
  "emp_status": "Active"
}

*/
export async function updateEmp(req, res) {
  const { emp_id } = req.params;
      console.log('error:', emp_id)

  try {
    await updateEmployee(emp_id, req.body);
    await auditLog({ action: 'employee_update', actor: { emp_id: req.user?.emp_id }, req, meta: { emp_id } });
    return ok(res, { message: 'Employee updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
PATCH {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}
into this can update one or all field can change
{
  "emp_name": "Vainyala",
  "emp_department": "IT"
}

*/
export async function updateEmpPartial(req, res) {
  const { emp_id } = req.params;
      console.log('error:', emp_id)

  try {
    await updateEmployeePartial(emp_id, req.body);
    await auditLog({ action: 'employee_update', actor: { emp_id: req.user?.emp_id }, req, meta: { emp_id } });
    return ok(res, { message: 'Employee updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
DELETE {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}

*/
export async function deleteEmp(req, res) {
  const { emp_id } = req.params;
  try {
    await deleteEmployee(emp_id);
    await auditLog({ action: 'employee_delete', actor: { emp_id: req.user?.emp_id }, req, meta: { emp_id } });
    return ok(res, { message: 'Employee deleted successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}
