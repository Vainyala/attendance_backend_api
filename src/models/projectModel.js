import { mariadb } from '../config/mariadb.js';

export async function createProject(data) {
  const {
    project_id, emp_id, project_name, project_site, client_name, client_location,
    client_contact, project_site_lat, project_site_long, mng_name, mng_email,
    mng_contact, project_description, project_techstack, project_assigned_date
  } = data;

  const [result] = await mariadb.execute(
    `INSERT INTO project_master (
      project_id, emp_id, project_name, project_site, client_name, client_location,
      client_contact, project_site_lat, project_site_long, mng_name, mng_email,
      mng_contact, project_description, project_techstack, project_assigned_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      project_id, emp_id,  project_name, project_site, client_name, client_location,
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
    emp_id = null, project_name = null, project_site= null, client_name= null, client_location= null,
    client_contact= null, project_site_lat= null, project_site_long= null, mng_name= null,
     mng_email = null ,mng_contact= null, project_description= null, project_techstack= null, 
     project_assigned_date  = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE project_master SET
      emp_id = ?, project_name = ?, project_site = ?, client_name = ?, client_location = ?,
      client_contact = ?, project_site_lat = ?, project_site_long = ?, mng_name = ?,
      mng_email = ?, mng_contact = ?, project_description = ?, project_techstack = ?,
      project_assigned_date = ?, updated_at = NOW()
    WHERE project_id = ?`,
    [
      emp_id, project_name, project_site, client_name, client_location,
      client_contact, project_site_lat, project_site_long, mng_name, mng_email,
      mng_contact, project_description, project_techstack, project_assigned_date,
      project_id
    ]
  );
  return result;
}

export async function updateProjectPartially(project_id, data) {
  const {
    emp_id = null, project_name = null, project_site= null, client_name= null, client_location= null,
    client_contact= null, project_site_lat= null, project_site_long= null, mng_name= null,
     mng_email = null ,mng_contact= null, project_description= null, project_techstack= null, 
     project_assigned_date  = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE project_master SET
      emp_id COALESCE(?, emp_id), project_name = COALESCE(?, project_name), project_site = COALESCE(?, project_site), 
      client_name = COALESCE(?, client_name), client_location = COALESCE(?, client_location),
      client_contact = COALESCE(?, client_contact), project_site_lat = COALESCE(?, project_site_lat), 
      project_site_long = COALESCE(?, project_site_long), mng_name = COALESCE(?, mng_name),
      mng_email = COALESCE(?, mng_email), mng_contact = COALESCE(?, mng_contact),
       project_description = COALESCE(?, project_description), project_techstack =COALESCE(?, project_techstack),
      project_assigned_date = COALESCE(?, project_assigned_date), updated_at = NOW()
    WHERE project_id = ?`,
    [
      emp_id, project_name, project_site, client_name, client_location,
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
