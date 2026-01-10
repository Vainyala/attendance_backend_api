const {createLeaves,getLeaves,
  getLeavesById,getLeavesByEmpId,
  updateLeaves,updateLeavesPartially,
  deleteLeaves } = require('../models/leavesModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { mariadb } = require('../config/mariadb.js');
const { getOrgShortNameFromEmp } = require('../utils/getOrgShortNameFromEmp.js')
const SerialNumberGenerator = require('../utils/serialGenerator.js');
/*
POST {{base_url}}/api/v1/regularization
Authorization: Bearer {{access_token}}

{
  "leave_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "leave_from_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Heavy Rain",
  "reg_approval_status": "REJECTED"
}
*/


async function create_leaves(req, res) {
 const connection = await mariadb.getConnection();

  let leave_id = null;   // ✅ DEFINE HERE

  console.log('req.body:', req.body);

  try {
    await connection.beginTransaction();

    const { emp_id, leave_from_date, leave_to_date, 
        leave_type, leave_justification } = req.body;

    if (!emp_id) {
      await connection.rollback();
      return badRequest(res, 'emp_id is required');
    }

    // ✅ FIX 1 USED HERE
    const org_short_name = await getOrgShortNameFromEmp(connection, emp_id);

    leave_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'leave',
      connection
    );

    //const
  //  = await CalculateShortfallHrs.calculate(
  //     connection,
  //     emp_id,
  //     leave_from_date
  //   );

    await createLeaves(connection, {
      leave_id,
      emp_id,
      leave_from_date,
      leave_to_date,
      leave_type,
      leave_justification
    });


    await auditLog({
      action: 'employee_leaves_create',
      actor: { emp_id },
      req,
      meta: { leave_id }
    });

    await connection.commit();

    return ok(res, {
      message: 'Employee Leaves created successfully',
      data: { leave_id }
    });

  } catch (err) {
    await connection.rollback();
    console.log('error:', err);

    // ✅ leave_id now SAFE
    await errorLog({ err, req, context: { leave_id } });

    return serverError(res);
  } finally {
    
    connection.release();
    console.log('Conncection is released...');
  }
}


/*
GET {{base_url}}/api/v1/regularization
Authorization: Bearer {{access_token}}

*/
async function list_leaves(req, res) {
  try {
    const reg = await getLeaves();
    return ok(res, reg);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}

*/
async function get_leaves(req, res) {
  const { leave_id } = req.params;
  console.log('Body:', req.params);
  try {
    const leave = await getLeavesById(leave_id);
    if (!leave) return notFound(res, 'Employee Leaves not found');
    return ok(res, leave);
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}


async function get_leavesByEmpId(req, res) {
  const { emp_id } = req.params;
  console.log('Body:', req.params);
  try {
    const leaves = await getLeavesByEmpId(emp_id);
    if (!leaves) return notFound(res, 'Employee not found');
    return ok(res, leaves);
  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { leave_id, emp_id } });
    return serverError(res);
  }
}
/*
PUT {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do

{
  "leave_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "leave_from_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Traffic", 
  "reg_approval_status": "REJECTED"
}


*/
async function update_leaves(req, res) {
  const { leave_id } = req.params;   // ✅ CORRECT

  console.log('update body:', req.body);
  try {
    await updateLeaves(leave_id, req.body);
    await auditLog({
      action: 'employee_leaves_update', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Leaves updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}

/*
PATCH {{base_url}}/api/v1/leaves/REG2025120003
Authorization: Bearer {{access_token}}
into this can update one or all field can change
{
   "reg_justification": "Heavy Rain",
}

*/
async function update_leavesPartially(req, res) {
  const { leave_id } = req.params;
  console.log('body:', req.body)

  try {
    await updateLeavesPartially(leave_id, req.body);
    await auditLog({
      action: 'employee_leaves_update', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Leaves  updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}

/*
DELETE {{base_url}}/api/v1/leaves/REG2025120003
Authorization: Bearer {{access_token}}

*/
async function delete_leaves(req, res) {
  const { leave_id } = req.params;
  try {
    await deleteLeaves(leave_id);
    await auditLog({
      action: 'employee_Leaves_delete', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Leaves deleted successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}


module.exports = {
  get_leaves,
  create_leaves,
  list_leaves,
  get_leavesByEmpId,
  update_leaves,
  update_leavesPartially,
  delete_leaves
}