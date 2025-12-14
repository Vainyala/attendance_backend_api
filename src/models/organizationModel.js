// src/models/organizationModel.js
import { mariadb } from '../config/mariadb.js';

/**
 * Create a new organization
 */
export async function createOrganization({ org_id, org_name, org_email }) {
  if (!org_id || !org_name || !org_email) {
    throw new Error('Missing required fields: org_id, org_name, org_email');
  }

  const [result] = await mariadb.execute(
    'INSERT INTO organization_master (org_id, org_name, org_email) VALUES (?, ?, ?)',
    [org_id, org_name, org_email]
  );
  return result;
}

/**
 * Get all organizations
 */
export async function getOrganizations() {
  const [rows] = await mariadb.execute('SELECT * FROM organization_master');
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
 * Update organization by ID
 */
export async function updateOrganization(org_id, { org_name, org_email }) {
  if (!org_id) {
    throw new Error('org_id is required');
  }

  const [result] = await mariadb.execute(
    'UPDATE organization_master SET org_name = ?, org_email = ?, updated_at = NOW() WHERE org_id = ?',
    [org_name ?? null, org_email ?? null, org_id]
  );
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
