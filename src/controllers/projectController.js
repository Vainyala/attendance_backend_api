const {
  createProject,
  getProjects,
  getProjectByProjectId,
  updateProject,
  updateProjectPartially,
  deleteProject
} = require('../models/projectModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const { formatProjects } = require('../utils/projectFormatter');
const { mariadb } = require('../config/mariadb.js');
const SerialNumberGenerator = require('../utils/serialGenerator.js');

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
async function createProj(req, res) {
  const connection = await mariadb.getConnection();

  console.log("body:", req.body);

  try {
    await connection.beginTransaction();

    const {
      org_short_name, project_name, project_site,
      client_name, client_location,
      client_contact, project_site_lat,
      project_site_long, mng_name, mng_email,
      mng_contact, project_description,
      project_techstack, project_assigned_date
    } = req.body;

    if (!project_name) {
      await connection.rollback();
      return badRequest(res, 'project_name is required');
    }

    if (!org_short_name) {
      await connection.rollback();
      return badRequest(res, 'org_short_name is required');
    }
    // ⭐ Generate project_id INSIDE SAME TRANSACTION
    const project_id = await SerialNumberGenerator.generateSerialNumber(
      org_short_name,
      'project',
      connection // 👈 IMPORTANT
    );

    await createProject(connection, {
      project_id, org_short_name, project_name,
      project_site, client_name, client_location,
      client_contact, project_site_lat, project_site_long,
      mng_name, mng_email, mng_contact,
      project_description, project_techstack, project_assigned_date
    });

    await auditLog({
      action: 'project_create', actor: {
        project_id: req.user?.project_id
      },
      req, meta: {
        project_id, org_short_name
      }
    });
    // ✅ commit ONLY after everything success
    await connection.commit();

    return ok(res, {
      message: 'Project created successfully',
      data: { project_id }
    });
  } catch (err) {
    console.log("error:", err);
    await connection.rollback();
    await errorLog({
      err, req, context: {
        project_id
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
async function listProjs(req, res) {
  try {
    const projects = await getProjects();
    return ok(res, projects);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

/*
GET {{base_url}}/api/v1/projects/PRJ001
Authorization: Bearer {{access_token}}

*/

async function getProj(req, res) {
  const { project_id } = req.params;

  try {
    const row = await getProjectByProjectId(project_id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Employee Project not found'
      });
    }

    // 🔹 reuse formatter (single → array → single)
    const response = formatProjects([row])[0];

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
}


/*
PUT {{base_url}}/api/v1/projects/PRJ001
Authorization: Bearer {{access_token}}
here should pass all fields names and into that update can do
{
  "project_name": "Smart City IoT Dashboard",
  "project_techstack": "Node.js, MongoDB, Grafana"
}

*/
async function updateProj(req, res) {
  const { project_id } = req.params;
  try {
    await updateProject(project_id, req.body);
    await auditLog({ action: 'project_update', actor: {
       org_short_name: req.user?.org_short_name }, req, meta: { project_id } });
    return ok(res, { message: 'Project updated successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
  }
}

/*
PATCH {{base_url}}/api/v1/projects/PRJ001
Authorization: Bearer {{access_token}}
into this can update one or all field can change partially
{
  "project_name": "Smart City IoT Dashboard",
  "project_techstack": "Node.js, MongoDB, Grafana"
}

*/
async function updateProjPartially(req, res) {
  console.log("body:", req.body);
  const { project_id } = req.params;
  try {
    await updateProjectPartially(project_id, req.body);
    await auditLog({ action: 'project_update', actor: { org_short_name: req.user?.org_short_name }, req, meta: { project_id } });
    return ok(res, { message: 'Project updated successfully' });
  } catch (err) {
    console.log("error:", err);
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
  }
}

/*
DELETE {{base_url}}/api/v1/projects/PRJ001
Authorization: Bearer {{access_token}}

*/
async function deleteProj(req, res) {
  const { project_id } = req.params;
  try {
    await deleteProject(project_id);
    await auditLog({ action: 'project_delete', actor: { org_short_name: req.user?.org_short_name }, req, meta: { project_id } });
    return ok(res, { message: 'Project deleted successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
  }
}

module.exports = {
  createProj,
  getProj,
  listProjs,
  updateProj,
  deleteProj,
  updateProjPartially
}