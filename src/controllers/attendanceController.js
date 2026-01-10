const {
  createAttendance, getAttendance, //getAttendanceById,
  getAttendanceWithSiteById,
  getAttendanceByEmpId, getAttendanceByDateRange
} = require('../models/attendanceModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { getOrgShortNameFromEmp } = require('../utils/getOrgShortNameFromEmp.js');
const { mariadb } = require('../config/mariadb.js');
const SerialNumberGenerator = require('../utils/serialGenerator.js');

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

async function createAtt(req, res) {
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
//get att by date range
async function listAtt(req, res) {
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


// get attendance by emp_id
async function getAttByEmpId(req, res) {
console.log("Attendance data called: ", req.params);
  const { emp_id } = req.params;

  try {
    const emp = await getAttendanceByEmpId(emp_id);

    if (!emp || emp.length === 0) {
      return notFound(res, 'Employee attendance not found');
    }

    return ok(res, emp);

  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { emp_id } });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/attendance/EMP001
Authorization: Bearer {{access_token}}

*/

async function getAtt(req, res) {
  const { att_id } = req.params;

  try {
    const row = await getAttendanceWithSiteById(att_id);

    if (!row) {
      return notFound(res, 'Employee attendance not found');
    }

    // 🔹 reshape response
    const response = {
      att_id: row.att_id,
      emp_id: row.emp_id,
      att_timestamp: row.att_timestamp,
      att_latitude: row.att_latitude,
      att_longitude: row.att_longitude,
      att_geofence_name: row.att_geofence_name,
      project_id: row.project_id,

      project_site: {
        project_site_name: row.project_site_name,
        project_site_lat: row.project_site_lat,
        project_site_long: row.project_site_long
      },

      att_notes: row.att_notes,
      att_status: row.att_status,
      verification_type: row.verification_type,
      is_verified: row.is_verified,
      created_at: row.created_at,
      updated_at: row.updated_at
    };

    return ok(res, response);

  } catch (err) {
    await errorLog({ err, req, context: { att_id } });
    return serverError(res);
  }
}

module.exports = {
  createAtt,
  listAtt,
  getAtt,
  getAttByEmpId
}
