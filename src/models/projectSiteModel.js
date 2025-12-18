import { mariadb } from '../config/mariadb.js';

export async function createProjectSite(connection,data) {
  const {
    project_site_id, project_id,
  project_site_name, project_site_lat, project_site_long
  } = data;

  const [result] = await connection.query(
    `INSERT INTO project_site_mapping (
       project_site_id, project_id,
  project_site_name, project_site_lat, project_site_long
    ) VALUES (?, ?, ?, ?, ?)`,
    [
       project_site_id, project_id,
  project_site_name, project_site_lat, project_site_long
    ]
  );
  return result;
}

export async function getProjectsSite() {
  const [rows] = await mariadb.execute('SELECT * FROM project_site_mapping');
  return rows;
}

export async function getProjectSiteById(project_site_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM project_site_mapping WHERE project_site_id = ? LIMIT 1',
    [project_site_id]
  );
  return rows[0] || null;
}
