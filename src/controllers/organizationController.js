const {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} = require('../models/organizationModel.js');
const { ok, badRequest, notFound, serverError } = require('../utils/response.js');
const { auditLog } = require('../audit/auditLogger.js');
const { errorLog } = require('../audit/errorLogger.js');
const SerialNumberGenerator = require('../utils/serialGenerator.js');

/*
Create an Organization - org_id is AUTO-GENERATED

POST http://localhost:4000/api/v1/organizations
{
  "org_short_name": "NUTANTEK",
  "org_name": "NutanTek Solutions LLP",
  "org_email": "info@nutantek.com"
}

*/
async function createOrg(req, res) {
  console.log("body:", req.body);
  const { org_name, org_short_name,
    org_email, office_working_start_day,
    office_working_end_day, office_start_hrs,
    office_end_hrs, working_hrs_in_number
  } = req.body || {};

  // Validate required fields (org_id is NO LONGER required from user)
  if (!org_short_name || !org_email) {
    return badRequest(res, 'org_short_name, and org_email are required', 'VALIDATION');
  }

  // Validate org_short_name length
  if (org_short_name.length > 10) {
    return badRequest(res, 'org_short_name must be maximum 10 characters', 'VALIDATION');
  }

  try {
    // ⭐ Auto-generate org_id (ORG1, ORG2, ORG3...)
    const org_id = await SerialNumberGenerator.generateOrgId();

    // Convert org_short_name to uppercase for consistency
    const normalizedShortName = org_short_name.toUpperCase();

    // Create organization with auto-generated org_id
    await createOrganization({
      org_id,
      org_name,
      org_short_name: normalizedShortName,
      org_email, office_working_start_day,
      office_working_end_day, office_start_hrs,
      office_end_hrs, working_hrs_in_number
    });

    await auditLog({
      action: 'org_create',
      actor: { org_id },
      req,
      meta: {
        org_name,
        org_short_name: normalizedShortName,
        org_email
      }
    });

    return ok(res, {
      message: 'Organization created successfully',
      data: {
        org_id
      }
    });
  } catch (err) {
    console.log("error:", err);

    // Check for duplicate org_short_name error
    if (err.code === 'ER_DUP_ENTRY') {
      return badRequest(res, 'Organization with this short name already exists', 'DUPLICATE');
    }

    await errorLog({ err, req, context: { org_short_name, org_name } });
    return serverError(res);
  }
}

// List Organizations
// GET http://localhost:4000/api/v1/organizations/list
async function listOrgs(req, res) {
  try {
    const orgs = await getOrganizations();
    return ok(res, orgs);
  } catch (err) {
    await errorLog({ err, req });
    return serverError(res);
  }
}

// Get an Organization by org_id
// GET http://localhost:4000/api/v1/organizations/ORG1
async function getOrg(req, res) {
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
  PUT http://localhost:4000/api/v1/organizations/ORG1
{
  "org_name": "NutanTek Solutions",
  "org_short_name": "NUTANTEK",
  "org_email": "contact@nutantek.com"
}
*/
async function updateOrg(req, res) {
  const { org_id } = req.params;
  if (!org_id) {
    return badRequest(res, 'org_id is required');
  }

  const { org_name, org_short_name, org_email } = req.body || {};

  // Validate org_short_name if provided
  if (org_short_name && org_short_name.length > 10) {
    return badRequest(res, 'org_short_name must be maximum 10 characters', 'VALIDATION');
  }

  try {
    // Normalize org_short_name to uppercase if provided
    const normalizedShortName = org_short_name ? org_short_name.toUpperCase() : undefined;

    await updateOrganization(org_id, {
      org_name,
      org_short_name: normalizedShortName,
      org_email
    });

    await auditLog({
      action: 'org_update',
      actor: { org_id },
      req,
      meta: {
        org_name,
        org_short_name: normalizedShortName,
        org_email
      }
    });

    return ok(res, { message: 'Organization updated successfully' });
  } catch (err) {
    // Check for duplicate org_short_name error
    if (err.code === 'ER_DUP_ENTRY') {
      return badRequest(res, 'Organization with this short name already exists', 'DUPLICATE');
    }

    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}

// Delete any Organization
// DELETE http://localhost:4000/api/v1/organizations/ORG1
async function deleteOrg(req, res) {
  const { org_id } = req.params;
  if (!org_id) {
    return badRequest(res, 'org_id is required');
  }

  try {
    await deleteOrganization(org_id);
    await auditLog({ action: 'org_delete', actor: { org_id }, req });
    return ok(res, { message: 'Organization deleted successfully' });
  } catch (err) {
    console.log('error:', err);
    await errorLog({ err, req, context: { org_id } });
    return serverError(res);
  }
}


module.exports = {
  createOrg,
  listOrgs,
  getOrg,
  updateOrg,
  deleteOrg
}