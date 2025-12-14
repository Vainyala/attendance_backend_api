import { mariadb } from '../config/mariadb.js';

export async function createProject(data) {
  const {
    project_id, project_name, project_site_id, client_name, client_location,
    client_contact, project_site_lat, project_site_long, mng_name, mng_email,
    mng_contact, project_description, project_techstack, project_assigned_date
  } = data;

  const [result] = await mariadb.execute(
    `INSERT INTO project_master (
      project_id, project_name, project_site_id, client_name, client_location,
      client_contact, project_site_lat, project_site_long, mng_name, mng_email,
      mng_contact, project_description, project_techstack, project_assigned_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      project_id, project_name, project_site_id, client_name, client_location,
      client_contact, project_site_lat, project_site_long, mng_name, mng_email,
      mng_contact, project_description, project_techstack, project_assigned_date
    ]
  );
  return result;
}

export async function getProjects() {
  const [rows] = await mariadb.execute('SELECT * FROM project_master');
  return rows;
}

export async function getProjectById(project_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM project_master WHERE project_id = ? LIMIT 1',
    [project_id]
  );
  return rows[0] || null;
}

export async function updateProject(project_id, data) {
  const {
    project_name, project_site_id, client_name, client_location,
    client_contact, project_site_lat, project_site_long, mng_name, mng_email,
    mng_contact, project_description, project_techstack, project_assigned_date
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE project_master SET
      project_name = ?, project_site_id = ?, client_name = ?, client_location = ?,
      client_contact = ?, project_site_lat = ?, project_site_long = ?, mng_name = ?,
      mng_email = ?, mng_contact = ?, project_description = ?, project_techstack = ?,
      project_assigned_date = ?, updated_at = NOW()
    WHERE project_id = ?`,
    [
      project_name, project_site_id, client_name, client_location,
      client_contact, project_site_lat, project_site_long, mng_name, mng_email,
      mng_contact, project_description, project_techstack, project_assigned_date,
      project_id
    ]
  );
  return result;
}

export async function deleteProject(project_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM project_master WHERE project_id = ?',
    [project_id]
  );
  return result;
}
