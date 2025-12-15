import {
  createAttendance,
  getAttendance,
  getAttendanceById,
//   updateAttendance,
//   updateAttendancePartially,
//   deleteAttendance
} from '../models/attendanceModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

/*
POST {{base_url}}/api/v1/attendance
Authorization: Bearer {{access_token}}
{
  "att_id": "EMP001",
  "emp_name": "Vainyala Samal",
  "emp_role": "App Developer",
  "emp_department": "IT",
  "emp_phone": "9767731178"
}

*/
export async function createAtt(req, res) {
  console.log('req.body:', req.body);
  const { att_id, emp_id } = req.body || {};
  if (!att_id || !emp_id) return badRequest(res, 'att_id and emp_id are required', 'VALIDATION');

  try {
    await createAttendance(req.body);
    await auditLog({ action: 'employee_attendance_create', actor: { att_id: req.user?.att_id }, req, meta: { att_id, emp_id } });
    return ok(res, { message: 'Employee attendance created successfully' });
  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { att_id } });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/attendance
Authorization: Bearer {{access_token}}

*/
export async function listAtt(req, res) {
  try {
    const att = await getAttendance();
    return ok(res, att);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/attendance/EMP001
Authorization: Bearer {{access_token}}

*/
export async function getAtt(req, res) {
  const { att_id } = req.params;
  try {
    const att = await getAttendanceById(att_id);
    if (!att) return notFound(res, 'Employee attendance not found');
    return ok(res, att);
  } catch (err) {
    await errorLog({ err, req, context: { att_id } });
    return serverError(res);
  }
}

// /*
// PUT {{base_url}}/api/v1/attendance/EMP001
// Authorization: Bearer {{access_token}}
// here should pass all fields names and into that update can do
// {
//   "org_id" : "ORG002",
//   "emp_name": "Samal Vainyala", (like Samal Vainyala to Vainyala)
//   "emp_email": "vainyala17@nutantek.com",
//   "emp_role": "Flutter Developer",
//   "emp_department": "App Development dept.",
//   "emp_phone" : "9767731178",
//   "emp_status": "Active"
// }

// */
// export async function updateAtt(req, res) {
//   const { att_id } = req.params;
//       console.log('error:', att_id)

//   try {
//     await updateAttendance(att_id, req.body);
//     await auditLog({ action: 'employee_attendance_update', actor: { att_id: req.user?.att_id }, req, meta: { att_id } });
//     return ok(res, { message: 'Employee Attendance updated successfully' });
//   } catch (err) {
//     console.log('error:', err)
//     await errorLog({ err, req, context: { att_id } });
//     return serverError(res);
//   }
// }

// /*
// PATCH {{base_url}}/api/v1/attendance/EMP001
// Authorization: Bearer {{access_token}}
// into this can update one or all field can change
// {
//   "emp_name": "Vainyala",
//   "emp_department": "IT"
// }

// */
// export async function updateAttPartially(req, res) {
//   const { att_id } = req.params;
//       console.log('error:', att_id)

//   try {
//     await updateAttendancePartial(att_id, req.body);
//     await auditLog({ action: 'employee_attendance_update', actor: { att_id: req.user?.att_id }, req, meta: { att_id } });
//     return ok(res, { message: 'Employee attendance updated successfully' });
//   } catch (err) {
//     console.log('error:', err)
//     await errorLog({ err, req, context: { att_id } });
//     return serverError(res);
//   }
// }

// /*
// DELETE {{base_url}}/api/v1/attendance/EMP001
// Authorization: Bearer {{access_token}}

// */
// export async function deleteAtt(req, res) {
//   const { att_id } = req.params;
//   try {
//     await deleteAttendance(att_id);
//     await auditLog({ action: 'employee_attendance_deleted', actor: { att_id: req.user?.att_id }, req, meta: { att_id } });
//     return ok(res, { message: 'Employee Attendance deleted successfully' });
//   } catch (err) {
//     await errorLog({ err, req, context: { att_id } });
//     return serverError(res);
//   }
// }
