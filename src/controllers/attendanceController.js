import {
  createAttendance,
  getAttendance,
  getAttendanceById,
  getAttendanceByEmpId,
  getAttendanceByDateRange
} from '../models/attendanceModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';
import { getOrgShortNameFromEmp } from '../utils/getOrgShortNameFromEmp.js'
import { mariadb } from '../config/mariadb.js';
import SerialNumberGenerator from '../utils/serialGenerator.js';

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
  const connection = await mariadb.getConnection();
  console.log('req.body:', req.body);

  try {
    await connection.beginTransaction();

    const {
      emp_id, att_latitude, att_longitude,
      att_geofence_name, project_id, att_notes,
      att_status, verification_type, is_verified
    } = req.body || {};

    // ✅ validation
    if (!emp_id) {
      await connection.rollback();
      return badRequest(res, 'emp_id is required');
    }

    // ⭐ STEP 1: Get org_short_name from emp_id
    const org_short_name = await getOrgShortNameFromEmp(connection, emp_id);

    // ⭐ STEP 2: Generate att_id (same transaction)
    const att_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'att',
      connection
    );

    // ⭐ STEP 3: Insert attendance
    await createAttendance(connection, {
      att_id, emp_id, att_latitude, att_longitude,
      att_geofence_name, project_id, att_notes,
      att_status, verification_type, is_verified
    });

    await auditLog({
      action: 'employee_attendance_create',
      actor: { emp_id: req.user?.emp_id },
      req,
      meta: { att_id, emp_id }
    });

    // ✅ commit only after success
    await connection.commit();

    return ok(res, {
      message: 'Employee attendance created successfully',
      data: { att_id }
    });

  } catch (err) {
    // ❌ any error → ID not consumed
    await connection.rollback();
    console.error('error:', err);
    await errorLog({ err, req });
    return serverError(res);
  } finally {
    connection.release();
  }
}

/*
GET {{base_url}}/api/v1/attendance
Authorization: Bearer {{access_token}}

*/
export async function listAtt(req, res) {
  const { from_date, to_date } = req.query;

  try {
    // ✅ if date range is provided → filter
    if (from_date && to_date) {
      const data = await getAttendanceByDateRange(from_date, to_date);
      return ok(res, {
        from_date,
        to_date,
        count: data.length,
        data
      });
    }
    if ((from_date && !to_date) || (!from_date && to_date)) {
      return badRequest(res, 'Both from_date and to_date are required');
    }

    // ❌ no date range → return all
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
    // fetch the latlong from project_master using the project_id
    //fetch the project_site_name from project_site_mapping using
    //  project_id and project_site_id
    const att = await getAttendanceById(att_id);
    if (!att) return notFound(res, 'Employee attendance not found');
    return ok(res, att);
  } catch (err) {
    await errorLog({ err, req, context: { att_id } });
    return serverError(res);
  }
}

//get att by date range


// get attendance by emp_id
export async function getAttByEmpId(req, res) {

  const { emp_id } = req.params;
  console.log('body:', req.body);
  try {
    // fetch the latlong from project_master using the project_id
    //fetch the project_site_name from project_site_mapping using project_id 
    // and project_site_id
    const emp = await getAttendanceByEmpId(emp_id);
    if (!emp) return notFound(res, 'Employee attendance not found');
    return ok(res, emp);
  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

// export async function getAttByDateRange(req, res) {
//   const { from_date, to_date } = req.query;

//   // ✅ validation
//   if (!from_date || !to_date) {
//     return badRequest(res, 'from_date and to_date are required');
//   }

//   try {
//     const data = await getAttendanceByDateRange(from_date, to_date);

//     return ok(res, {
//       from_date,
//       to_date,
//       count: data.length,
//       data
//     });
//   } catch (err) {
//     console.error(err);
//     await errorLog({ err, req });
//     return serverError(res);
//   }
// }
