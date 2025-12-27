import {createLeaves,getLeaves,
  getLeavesById,getLeavesByEmpId,
  updateLeaves,updateLeavesPartially,
  deleteLeaves } from '../models/leavesModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';
import { mariadb } from '../config/mariadb.js';
import { getOrgShortNameFromEmp } from '../utils/getOrgShortNameFromEmp.js'
import SerialNumberGenerator from '../utils/serialGenerator.js';
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


export async function create_leaves(req, res) {
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

    const {
      first_checkin,
      last_checkout,
      shortfall_hrs
    } = await CalculateShortfallHrs.calculate(
      connection,
      emp_id,
      leave_from_date
    );

    await createRegularization(connection, {
      leave_id,
      emp_id,
      leave_from_date,
      leave_justification,
      reg_first_check_in: first_checkin,  // ✅ add this
      reg_last_check_out: last_checkout,  // ✅ add this
      shortfall_hrs
    });


    await auditLog({
      action: 'employee_regularization_create',
      actor: { emp_id },
      req,
      meta: { leave_id }
    });

    await connection.commit();

    return ok(res, {
      message: 'Employee Regularization created successfully',
      data: { leave_id, shortfall_hrs }
    });

  } catch (err) {
    await connection.rollback();
    console.log('error:', err);

    // ✅ leave_id now SAFE
    await errorLog({ err, req, context: { leave_id } });

    return serverError(res);
  } finally {
    connection.release();
  }
}


/*
GET {{base_url}}/api/v1/regularization
Authorization: Bearer {{access_token}}

*/
export async function listReg(req, res) {
  try {
    const reg = await getRegularization();
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
export async function getReg(req, res) {
  const { leave_id } = req.params;
  try {
    const reg = await getRegularizationById(leave_id);
    if (!reg) return notFound(res, 'Employee not found');
    return ok(res, reg);
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}


export async function getRegByEmpId(req, res) {
  const { emp_id } = req.params;
  try {
    const reg = await getRegularizationByEmpId(emp_id);
    if (!reg) return notFound(res, 'Employee not found');
    return ok(res, reg);
  } catch (err) {
    console.log('error:', err)
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
export async function updateReg(req, res) {
  const { leave_id } = req.params;   // ✅ CORRECT

  console.log('update body:', req.body);
  try {
    await updateRegularization(leave_id, req.body);
    await auditLog({
      action: 'employee_regularization_update', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Regularization updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}

/*
PATCH {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}
into this can update one or all field can change
{
   "reg_justification": "Heavy Rain",
}

*/
export async function updateRegPartially(req, res) {
  const { leave_id } = req.params;
  console.log('error:', req.body)

  try {
    await updateRegularizationPartially(leave_id, req.body);
    await auditLog({
      action: 'employee_regularization_update', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Regularization  updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}

/*
DELETE {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}

*/
export async function deleteReg(req, res) {
  const { leave_id } = req.params;
  try {
    await deleteRegularization(leave_id);
    await auditLog({
      action: 'employee_regularization_delete', actor: {
        leave_id: req.user?.leave_id

      }, req, meta: { leave_id }
    });
    return ok(res, { message: 'Employee Regularization deleted successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { leave_id } });
    return serverError(res);
  }
}
