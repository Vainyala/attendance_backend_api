import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} from '../models/organizationModel.js';
import { ok, badRequest, notFound, serverError } from '../utils/response.js';
import { auditLog } from '../audit/auditLogger.js';
import { errorLog } from '../audit/errorLogger.js';

/*
Create an Organization

POST http://localhost:4000/api/v1/organizations
{
  "org_id": "ORG001",
  "org_name": "NutanTek Solutions LLP",
  "org_email": "info@nutantek.com"
}

*/
export async function createOrg(req, res) {
  console.log("body:", req.body);
  const { org_id, org_name, org_email } = req.body || {};
  if (!org_id) return badRequest(res, 'org_id is required', 'VALIDATION');

  try {
    await createOrganization({ org_id, org_name, org_email });
    await auditLog({ action: 'org_create', actor: { org_id }, req, meta: { org_name, org_email } });
    return ok(res, { message: 'Organization created successfully' });
  } catch (err) {
    console.log("error:", err);
    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}


// List Organizations
// GET http://localhost:4000/api/v1/organizations

export async function listOrgs(req, res) {
  try {
    const orgs = await getOrganizations();
    return ok(res, orgs);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}


// Get an Organization by org_id
// GET http://localhost:4000/api/v1/organizations/NUTANTEK

export async function getOrg(req, res) {
  const { org_id } = req.params;
  if (!org_id) {
  return badRequest(res, 'org_id is required');
}

  try {
    const org = await getOrganizationById(org_id);
    if (!org) return notFound(res, 'Organization not found');
    return ok(res, org);
  } catch (err) {
    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}


/*  Update an Organization
  PUT http://localhost:4000/api/v1/organizations/ORG001
{
  "org_name": "NutanTek Solutions",
  "org_email": "contact@nutantek.com"
}
*/
export async function updateOrg(req, res) {
  const { org_id } = req.params;
   if (!org_id) {
        return badRequest(res, 'org_id is required');
    }
  const { org_name, org_email } = req.body || {};
  try {
    await updateOrganization(org_id, { org_name, org_email });
    await auditLog({ action: 'org_update', actor: { org_id }, req, meta: { org_name, org_email } });
    return ok(res, { message: 'Organization updated successfully' });
  } catch (err) {
    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}


// Delete any Organization
// DELETE http://localhost:4000/api/v1/organizations/ORG001

export async function deleteOrg(req, res) {
  const { org_id } = req.params;
   if (!org_id) {
        return badRequest(res, 'org_id is required');
    }
  try {
    await deleteOrganization(org_id);
    await auditLog({ action: 'org_delete', actor: { org_id }, req });
    return ok(res, { message: 'Organization deleted successfully' });
  } catch (err) {
    console.log('error:', err)
    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}
