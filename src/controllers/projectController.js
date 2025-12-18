import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateProjectPartially,
  deleteProject
} from '../models/projectModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

import { mariadb } from '../config/mariadb.js';
import SerialNumberGenerator from '../utils/serialGenerator.js';

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
export async function createProj(req, res) {
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
export async function listProjs(req, res) {
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
export async function getProj(req, res) {
  const { project_id } = req.params;
  try {
    const project = await getProjectById(project_id);
    if (!project) return notFound(res, 'Project not found');
    return ok(res, project);
  } catch (err) {
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
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
export async function updateProj(req, res) {
  const { project_id } = req.params;
  try {
    await updateProject(project_id, req.body);
    await auditLog({ action: 'project_update', actor: { org_short_name: req.user?.org_short_name }, req, meta: { project_id } });
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
export async function updateProjPartially(req, res) {
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
export async function deleteProj(req, res) {
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
