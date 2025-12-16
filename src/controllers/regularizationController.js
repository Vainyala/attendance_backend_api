import {
    createRegularization,
    getRegularization,
    getRegularizationById,
    updateRegularization,
    updateRegularizationPartially,
    deleteRegularization
} from '../models/regularizationModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

/*
POST {{base_url}}/api/v1/regularization
Authorization: Bearer {{access_token}}

{
  "reg_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "reg_applied_for_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Heavy Rain",
  "reg_approval_status": "REJECTED"
}


*/


//update att by manager
// {
//   "emp_id": "NUTANTEKE20250600002",
 //    "mgr_emp_id"  : "NUTANTEKM20250600002"
//   "reg_applied_for_date": "2025-12-05",
//   "shortfall_hrs": 9.00,
//   "reg_justification": " ertertfgrdfgfdgdg",
//   "reg_approval_status": "REJECTED"
//  "mgr_comments" :"asdsdfsd"
// }


export async function createReg(req, res) {
    console.log('req.body:', req.body);
    const { reg_id, emp_id } = req.body || {};
    if (!reg_id || !emp_id) return badRequest(res, 'reg_id and emp_id are required', 'VALIDATION');

    try {
        await createRegularization(req.body);
        await auditLog({
            action: 'employee_regularization_create', actor: {
                reg_id: req.user?.reg_id
            },
            req, meta: {
                reg_id, emp_id
            }
        });
        return ok(res, { message: 'Employee Regularization created successfully',
            data: { reg_id }
        });
    } catch (err) {
        console.log('error:', err);
        await errorLog({ err, req, context: { reg_id } });
        return serverError(res);
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
    const { reg_id } = req.params;
    try {
        const reg = await getRegularizationById(reg_id);
        if (!reg) return notFound(res, 'Employee not found');
        return ok(res, reg);
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { reg_id } });
        return serverError(res);
    }
}

/*
PUT {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do

{
  "reg_id": "REG2025120003",
  "emp_id": "NUTANTEKE20250600002",
  "reg_applied_for_date": "2025-12-05",
  "shortfall_hrs": 9.00,
  "reg_justification": "Traffic", 
  "reg_approval_status": "REJECTED"
}


*/
export async function updateReg(req, res) {
    const { reg_id } = req.params;   // ✅ CORRECT

    console.log('update body:', req.body);
    try {
        await updateRegularization(reg_id, req.body);
        await auditLog({
            action: 'employee_regularization_update', actor: {
                reg_id: req.user?.reg_id

            }, req, meta: { reg_id }
        });
        return ok(res, { message: 'Employee Regularization updated successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { reg_id } });
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
    const { reg_id } = req.params;
    console.log('error:', req.body)

    try {
        await updateRegularizationPartially(reg_id, req.body);
        await auditLog({
            action: 'employee_regularization_update', actor: {
                reg_id: req.user?.reg_id

            }, req, meta: { reg_id }
        });
        return ok(res, { message: 'Employee Regularization  updated successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { reg_id } });
        return serverError(res);
    }
}

/*
DELETE {{base_url}}/api/v1/regularization/REG2025120003
Authorization: Bearer {{access_token}}

*/
export async function deleteReg(req, res) {
    const { reg_id } = req.params;
    try {
        await deleteRegularization(reg_id);
        await auditLog({
            action: 'employee_regularization_delete', actor: {
                reg_id: req.user?.reg_id

            }, req, meta: { reg_id }
        });
        return ok(res, { message: 'Employee Regularization deleted successfully' });
    } catch (err) {
        console.log('error:', err)
        await errorLog({ err, req, context: { reg_id } });
        return serverError(res);
    }
}
