const {
  createEmployee,
  getEmployee,
  getEmployeeById,
  updateEmployee,
  updateEmployeePartially,
  deleteEmployee
} = require('../models/employeeModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { mariadb } = require('../config/mariadb.js');
const  SerialNumberGenerator = require('../utils/serialGenerator.js');


/*
POST {{base_url}}/api/v1/employee
Authorization: Bearer {{access_token}}
{
  "emp_name": "Vainyala Samal",
  "emp_role": "App Developer",
  "emp_department": "IT",
  "emp_phone": "9767731178"
}

*/

async function createEmp(req, res) {
 const connection = await mariadb.getConnection();

  console.log("body: ", req.body);
  try {
    await connection.beginTransaction();

    const {
      emp_name,
      org_short_name,
      emp_email,
      emp_role,
      emp_department,
      emp_phone,
      emp_status
    } = req.body;

    // ✅ validations
    if (!emp_name) {
      await connection.rollback();
      return badRequest(res, 'emp_name is required');
    }

    if (!org_short_name) {
      await connection.rollback();
      return badRequest(res, 'org_short_name is required');
    }

    // ⭐ Generate emp_id INSIDE SAME TRANSACTION
    const emp_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'emp',
      connection // 👈 IMPORTANT
    );

    // ⭐ Call MODEL function (clean)
    await createEmployee(connection, {
      emp_id,
      org_short_name,
      emp_name,
      emp_email,
      emp_role,
      emp_department,
      emp_phone,
      emp_status
    });
    await auditLog({
      action: 'employee_create',
      actor: { emp_id: req.user?.emp_id },
      req,
      meta: { emp_id, emp_name, org_short_name }
    });

    // ✅ commit ONLY after everything success
    await connection.commit();

    return ok(res, {
      message: 'Employee created successfully',
      data: { emp_id }
    });

  } catch (err) {
    console.log('error:', err);
    // ❌ error → ID NOT consumed
    await connection.rollback();
    await errorLog({ err, req });
    return serverError(res);
  } finally {
    connection.release();
  }
}


/*
GET {{base_url}}/api/v1/employee
Authorization: Bearer {{access_token}}

*/
async function listEmp(req, res) {
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
async function getEmp(req, res) {
  console.log("Employee data called: ", req.params);
  const { emp_id } = req.params;
  try {
    const emp = await getEmployeeById(emp_id);
    if (!emp) return notFound(res, 'Employee not found');
    return ok(res, emp);
  } catch (err) {
    console.log("Employee data error: ", err);
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
PUT {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do
{
  "org_short_name" : "ORG002",
  "emp_name": "Samal Vainyala", (like Samal Vainyala to Vainyala)
  "emp_email": "vainyala17@nutantek.com",
  "emp_role": "Flutter Developer",
  "emp_department": "App Development dept.",
  "emp_phone" : "9767731178",
  "emp_status": "Active"
}

*/
async function updateEmp(req, res) {
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
async function updateEmpPartially(req, res) {
  const { emp_id } = req.params;
  console.log('error:', emp_id)

  try {
    await updateEmployeePartially(emp_id, req.body);
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
async function deleteEmp(req, res) {
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

module.exports = {
  createEmp,
  listEmp,
  getEmp,
  updateEmp,
  updateEmpPartially,
  deleteEmp
}