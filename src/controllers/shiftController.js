import {
  createShiftMaster,
  getShiftMaster,
  getShiftMasterById,
  updateShiftMaster,
  deleteShiftMaster
} from '../models/shiftModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

import { mariadb } from '../config/mariadb.js';
import SerialNumberGenerator from '../utils/serialGenerator.js';
/*
POST {{base_url}}/api/v1/shift
Authorization: Bearer {{access_token}}
{
  "shift_id": "M001",
  "shift_name": "Morning",
  "shift_start_time": "9 am",
  "shift_start_time": "5 pm",
}

*/
export async function createShift(req, res) {
  const connection = await mariadb.getConnection();

  console.log('req.body:', req.body);

  try {
    await connection.beginTransaction();
    const {
      org_short_name,
      shift_name, shift_start_time,
      shift_end_time
    } = req.body;

    // ✅ validations
    if (!shift_name) {
      await connection.rollback();
      return badRequest(res, 'shift_name is required');
    }

    if (!org_short_name) {
      await connection.rollback();
      return badRequest(res, 'org_short_name is required');
    }

    // ⭐ Generate shift_id INSIDE SAME TRANSACTION
    const shift_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'shift',
      connection // 👈 IMPORTANT
    );

    // ⭐ Call MODEL function (clean)
    await createShiftMaster(connection, {
      shift_id, org_short_name,
      shift_name, shift_start_time,
      shift_end_time
    });

    await auditLog({
      action: 'shift_create', actor: { shift_id: req.user?.shift_id },
      req, meta: { shift_id, org_short_name }
    });

    // ✅ commit ONLY after everything success
    await connection.commit();

    return ok(res, {
      message: 'Shift created successfully',
      data: { shift_id }
    });

  } catch (err) {
    console.log('error:', err);
    await connection.rollback();
    await errorLog({ err, req, context: { shift_id } });
    return serverError(res);
  }
  finally {
    connection.release();
  }
}

/*
GET {{base_url}}/api/v1/shift
Authorization: Bearer {{access_token}}

*/
export async function listShift(req, res) {
  try {
    const sft = await getShiftMaster();
    return ok(res, sft);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/shift/M001
Authorization: Bearer {{access_token}}

*/
export async function getShift(req, res) {
  const { shift_id } = req.params;
  try {
    const sft = await getShiftMasterById(shift_id);
    if (!sft) return notFound(res, 'Shift not found');
    return ok(res, sft);
  } catch (err) {
    await errorLog({ err, req, context: { shift_id } });
    return serverError(res);
  }
}

/*
PUT {{base_url}}/api/v1/shift/M001
Authorization: Bearer {{access_token}}
{
  "shift_id": "A001",
  "shift_name": "Afternoon",
  "shift_start_time": "2 pm",
  "shift_start_time": "11 pm",
}

*/
export async function updateShift(req, res) {
  const { shift_id } = req.params;
  console.log('error:', shift_id)

  try {
    await updateShiftMaster(shift_id, req.body);
    await auditLog({ action: 'shift_update', actor: { shift_id: req.user?.shift_id }, req, meta: { shift_id } });
    return ok(res, { message: 'Shift updated successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { shift_id } });
    return serverError(res);
  }
}

/*
DELETE {{base_url}}/api/v1/employee/EMP001
Authorization: Bearer {{access_token}}

*/
export async function deleteShift(req, res) {
  const { shift_id } = req.params;
  try {
    await deleteShiftMaster(shift_id);
    await auditLog({ action: 'shift_delete', actor: { shift_id: req.user?.shift_id }, req, meta: { shift_id } });
    return ok(res, { message: 'Shift deleted successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { shift_id } });
    return serverError(res);
  }
}
