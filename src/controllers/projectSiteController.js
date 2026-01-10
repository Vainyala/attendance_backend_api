const {
  createProjectSite,
  getProjectsSite,
  getProjectSiteById,
//   updateProject,
//   updateProjectPartially,
//   deleteProject
} = require('../models/projectSiteModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');

const { mariadb } = require('../config/mariadb.js');
const SerialNumberGenerator = require('../utils/serialGenerator.js');
const { getOrgShortNameFromProj } = require('../utils/getOrgShortNameFromEmp.js');
const { get } = require('../routes/shiftRoutes');

/*
POST {{base_url}}/api/v1/projects
Authorization: Bearer {{access_token}}
{
  "project_id": "PRJ001",
  "project_name": "Smart City Dashboard",
  "client_name": "Govt of India",
  "mng_name": "NutanTek",
  "project_description": "Real-time monitoring system"
}

*/
async function createProjSite(req, res) {
 const connection = await mariadb.getConnection();

  console.log("body:", req.body);

  try {
    await connection.beginTransaction();

    const {
       project_id,
  project_site_name,
  project_site_lat,
  project_site_long
    } = req.body;

    if (!project_site_name) {
      await connection.rollback();
      return badRequest(res, 'project_site_name is required');
    }

    // if (!org_short_name) {
    //   await connection.rollback();
    //   return badRequest(res, 'org_short_name is required');
    // }

   // ⭐ STEP 1: Get org_short_name from emp_id
    const org_short_name = await getOrgShortNameFromProj(connection, project_id);

    // ⭐ Generate project_id INSIDE SAME TRANSACTION
    const project_site_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'project_site',
      connection // 👈 IMPORTANT
    );

    await createProjectSite(connection, {
       project_site_id, project_id, project_site_name,
       project_site_lat, project_site_long
    });

    await auditLog({
      action: 'project_site_create', actor: {
        project_site_id: req.user?.project_site_id
      },
      req, meta: {
        project_site_id, project_id
      }
    });
    // ✅ commit ONLY after everything success
    await connection.commit();

    return ok(res, {
      message: 'Project Site created successfully',
      data: { project_site_id }
    });
  } catch (err) {
    console.log("error:", err);
    await connection.rollback();
    await errorLog({
      err, req, context: {
        project_site_id
      }
    });
    return serverError(res);
  }
  finally {
    connection.release();
  }
}

/*
GET {{base_url}}/api/v1/projects
Authorization: Bearer {{access_token}}

*/
async function listProjsSite(req, res) {
  try {
    const projectsSite = await getProjectsSite();
    return ok(res, projectsSite);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/projects/PRJ001
Authorization: Bearer {{access_token}}

*/
 async function getProjSite(req, res) {
    console.log('body:', req.body);
  const { project_site_id } = req.params;
  try {
    const projectSite = await getProjectSiteById(project_site_id);
    if (!projectSite) return notFound(res, 'Project Site not found');
    return ok(res, projectSite);
  } catch (err) {
       console.log('errorr:', err);
    await errorLog({ err, req, context: { project_site_id } });
    return serverError(res);
  }
}

module.exports = {
  createProjSite,
  listProjsSite,
  getProjSite
}