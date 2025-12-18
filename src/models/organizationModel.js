// src/models/organizationModel.js
import { mariadb } from '../config/mariadb.js';

/**
 * Create a new organization
 * org_id is now auto-generated, so it comes from the controller
 */
export async function createOrganization({
  org_id, org_name, org_short_name, org_email
}) {
  if (!org_id || !org_name || !org_short_name || !org_email) {
    throw new Error('Missing required fields: org_id, org_name, org_short_name, org_email');
  }

  const [result] = await mariadb.execute(
    'INSERT INTO organization_master (org_id, org_name, org_short_name, org_email) VALUES (?, ?, ?, ?)',
    [org_id, org_name, org_short_name, org_email]
  );
  return result;
}

/**
 * Get all organizations
 */
export async function getOrganizations() {
  const [rows] = await mariadb.execute(
    'SELECT org_id, org_name, org_short_name, org_email, created_at, updated_at FROM organization_master ORDER BY created_at DESC'
  );
  return rows;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(org_id) {
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
 * Get organization by short name

export async function getOrganizationByShortName(org_short_name) {
  if (!org_short_name) {
    throw new Error('org_short_name is required');
  }

  const [rows] = await mariadb.execute(
    'SELECT * FROM organization_master WHERE org_short_name = ? LIMIT 1',
    [org_short_name]
  );
  return rows[0] || null;
}
 */

/**
 * Update organization by ID
 */
export async function updateOrganization(org_id, { org_name, org_short_name, org_email }) {
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
export async function deleteOrganization(org_id) {
  if (!org_id) {
    throw new Error('org_id is required');
  }

  const [result] = await mariadb.execute(
    'DELETE FROM organization_master WHERE org_id = ?',
    [org_id]
  );
  return result;
}