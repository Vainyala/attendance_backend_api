// src/models/organizationModel.js
const { mariadb } = require('../config/mariadb.js');

/**
 * Create a new organization
 * org_id is now auto-generated, so it comes from the controller
 */
async function createOrganization({
  org_id, org_name, org_short_name, org_email,office_working_start_day,
  office_working_end_day,office_start_hrs,office_end_hrs,working_hrs_in_number
}) {
  if (!org_id || !org_short_name || !org_email) {
    throw new Error('Missing required fields: org_id, org_short_name, org_email');
  }

  const [result] = await mariadb.execute(
    `INSERT INTO organization_master 
    (org_id, org_name, org_short_name,
     org_email, office_working_start_day,
  office_working_end_day, office_start_hrs,
  office_end_hrs, working_hrs_in_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [org_id, org_name, org_short_name, org_email,office_working_start_day,
  office_working_end_day, office_start_hrs,
  office_end_hrs, working_hrs_in_number]
  );
  return result;
}

/**
 * Get all organizations
 */
async function getOrganizations() {
  const [rows] = await mariadb.execute('SELECT * FROM organization_master'
  );
  return rows;
}

/**
 * Get organization by ID
 */
async function getOrganizationById(org_id) {
  if (!org_id) {
    throw new Error('org_id is required');
  }

  const [rows] = await mariadb.execute(
    'SELECT * FROM organization_master WHERE org_id = ? LIMIT 1',
    [org_id]
  );
  return rows[0] || null;
}


/**
 * Update organization by ID
 */
async function updateOrganization(org_id,
   { org_name, org_short_name, org_email

    }) {

  if (!org_id) {
    throw new Error('org_id is required');
  }

  // Build dynamic update query based on provided fields
  const updates = [];
  const params = [];

  if (org_name !== undefined) {
    updates.push('org_name = ?');
    params.push(org_name);
  }
  if (org_short_name !== undefined) {
    updates.push('org_short_name = ?');
    params.push(org_short_name);
  }
  if (org_email !== undefined) {
    updates.push('org_email = ?');
    params.push(org_email);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  updates.push('updated_at = NOW()');
  params.push(org_id);

  const query = `UPDATE organization_master SET ${updates.join(', ')} WHERE org_id = ?`;
  
  const [result] = await mariadb.execute(query, params);
  return result;
}

/**
 * Delete organization by ID
 */
async function deleteOrganization(org_id) {
  if (!org_id) {
    throw new Error('org_id is required');
  }

  const [result] = await mariadb.execute(
    'DELETE FROM organization_master WHERE org_id = ?',
    [org_id]
  );
  return result;
}

module.exports = {
  createOrganization,
  getOrganizationById,
  getOrganizations,
  updateOrganization,
  deleteOrganization
}