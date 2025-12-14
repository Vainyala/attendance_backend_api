import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../models/projectModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

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
  const { project_id, project_name } = req.body || {};
  if (!project_id || !project_name) return badRequest(res, 'project_id and project_name are required', 'VALIDATION');

  try {
    await createProject(req.body);
    await auditLog({ action: 'project_create', actor: { emp_id: req.user?.emp_id }, req, meta: { project_id, project_name } });
    return ok(res, { message: 'Project created successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
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
{
  "project_name": "Smart City IoT Dashboard",
  "project_techstack": "Node.js, MongoDB, Grafana"
}

*/
export async function updateProj(req, res) {
  const { project_id } = req.params;
  try {
    await updateProject(project_id, req.body);
    await auditLog({ action: 'project_update', actor: { emp_id: req.user?.emp_id }, req, meta: { project_id } });
    return ok(res, { message: 'Project updated successfully' });
  } catch (err) {
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
    await auditLog({ action: 'project_delete', actor: { emp_id: req.user?.emp_id }, req, meta: { project_id } });
    return ok(res, { message: 'Project deleted successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { project_id } });
    return serverError(res);
  }
}
