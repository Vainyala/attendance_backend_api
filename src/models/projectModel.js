const { mariadb } = require('../config/mariadb.js');


//without est_dates
// async function createProject(connection,data) {
//   const {
//     project_id, org_short_name, project_name, client_name, client_location,
//     client_contact, mng_name, mng_email,
//     mng_contact, project_description, project_techstack, project_assigned_date
//   } = data;

//   const [result] = await connection.query(
//     `INSERT INTO project_master (
//       project_id, org_short_name, project_name,  client_name, client_location,
//       client_contact, mng_name, mng_email,
//       mng_contact, project_description, project_techstack, project_assigned_date
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       project_id, org_short_name,  project_name, client_name, client_location,
//       client_contact,  mng_name, mng_email,
//       mng_contact, project_description, project_techstack, project_assigned_date
//     ]
//   );
//   return result;
// }

//with est_dates
async function createProject(connection, data) {
  const {
    project_id, org_short_name, project_name, client_name, client_location,
    client_contact, mng_name, mng_email, mng_contact,
    project_description, project_techstack, project_assigned_date,
    est_start_date, est_end_date, actual_start_date, actual_end_date
  } = data;


  const [result] = await connection.query(
    `INSERT INTO project_master (
  project_id, org_short_name, project_name, client_name, client_location,
  client_contact, mng_name, mng_email, mng_contact,
  project_description, project_techstack, project_assigned_date,
  est_start_date, est_end_date, actual_start_date, actual_end_date
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      project_id, org_short_name, project_name, client_name, client_location,
      client_contact, mng_name, mng_email, mng_contact,
      project_description, project_techstack, project_assigned_date,
      est_start_date, est_end_date, actual_start_date, actual_end_date
    ]

  );
  return result;
}

async function getProjects() {
  const [rows] = await mariadb.execute('SELECT * FROM project_master');
  return rows;
}

async function getProjectById(project_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM project_master WHERE project_id = ? LIMIT 1',
    [project_id]
  );
  return rows[0] || null;
}

async function getProjectByProjectId(project_id) {
  const [rows] = await mariadb.execute(
    `
    SELECT 
      pm.*,
      psm.project_site_name,
      psm.project_site_lat,
      psm.project_site_long
    FROM project_master pm
    LEFT JOIN project_site_mapping psm
      ON pm.project_id = psm.project_id
    WHERE pm.project_id = ?
    LIMIT 1
    `,
    [project_id]
  );

  return rows[0] || null;
}

// async function updateProject(project_id, data) {
//   const {
//     org_short_name = null, project_name = null, client_name= null, client_location= null,
//     client_contact= null, mng_name= null,
//      mng_email = null ,mng_contact= null, project_description= null, project_techstack= null, 
//      project_assigned_date  = null
//   } = data;

//   const [result] = await mariadb.execute(
//     `UPDATE project_master SET
//       org_short_name = ?, project_name = ?, client_name = ?, client_location = ?,
//       client_contact = ?,mng_name = ?,
//       mng_email = ?, mng_contact = ?, project_description = ?, project_techstack = ?,
//       project_assigned_date = ?, updated_at = NOW()
//     WHERE project_id = ?`,
//     [
//       org_short_name, project_name,  client_name, client_location,
//       client_contact, mng_name, mng_email,
//       mng_contact, project_description, project_techstack, project_assigned_date,
//       project_id
//     ]
//   );
//   return result;
// }


//with es_dated

async function updateProject(project_id, data) {
  const {
    org_short_name = null, project_name = null, client_name = null,
    client_location = null, client_contact = null, mng_name = null,
    mng_email = null, mng_contact = null, project_description = null,
    project_techstack = null, project_assigned_date = null,
    est_start_date = null, est_end_date = null,
    actual_start_date = null, actual_end_date = null
  } = data;


  const [result] = await mariadb.execute(
    `UPDATE project_master SET
  org_short_name = ?, project_name = ?, client_name = ?, client_location = ?,
  client_contact = ?, mng_name = ?, mng_email = ?, mng_contact = ?,
  project_description = ?, project_techstack = ?, project_assigned_date = ?,
  est_start_date = ?, est_end_date = ?,
  actual_start_date = ?, actual_end_date = ?,
  updated_at = NOW()
WHERE project_id = ?`,
    [
      org_short_name, project_name, client_name, client_location,
      client_contact, mng_name, mng_email, mng_contact,
      project_description, project_techstack, project_assigned_date,
      est_start_date, est_end_date, actual_start_date, actual_end_date,
      project_id
    ]

  );
  return result;
}

// async function updateProjectPartially(project_id, data) {
//   const {
//     org_short_name = null, project_name = null,client_name= null, client_location= null,
//     client_contact= null,  mng_name= null,mng_email = null ,
//     mng_contact= null, project_description= null, project_techstack= null, 
//      project_assigned_date  = null
//   } = data;

//   const [result] = await mariadb.execute(
//     `UPDATE project_master SET
//       org_short_name COALESCE(?, org_short_name), project_name = COALESCE(?, project_name),
//       client_name = COALESCE(?, client_name), client_location = COALESCE(?, client_location),
//       client_contact = COALESCE(?, client_contact),  mng_name = COALESCE(?, mng_name),
//       mng_email = COALESCE(?, mng_email), mng_contact = COALESCE(?, mng_contact),
//        project_description = COALESCE(?, project_description), project_techstack =COALESCE(?, project_techstack),
//       project_assigned_date = COALESCE(?, project_assigned_date), updated_at = NOW()
//     WHERE project_id = ?`,
//     [
//       org_short_name, project_name, client_name, client_location,
//       client_contact, mng_name, mng_email,
//       mng_contact, project_description, project_techstack, project_assigned_date,
//       project_id
//     ]
//   );
//   return result;
// }


async function updateProjectPartially(project_id, data) {
  const {
    org_short_name = null,
    project_name = null,
    client_name = null,
    client_location = null,
    client_contact = null,
    mng_name = null,
    mng_email = null,
    mng_contact = null,
    project_description = null,
    project_techstack = null,
    project_assigned_date = null,

    // ✅ NEW DATE FIELDS
    est_start_date = null,
    est_end_date = null,
    actual_start_date = null,
    actual_end_date = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE project_master SET
      org_short_name = COALESCE(?, org_short_name),
      project_name = COALESCE(?, project_name),
      client_name = COALESCE(?, client_name),
      client_location = COALESCE(?, client_location),
      client_contact = COALESCE(?, client_contact),
      mng_name = COALESCE(?, mng_name),
      mng_email = COALESCE(?, mng_email),
      mng_contact = COALESCE(?, mng_contact),
      project_description = COALESCE(?, project_description),
      project_techstack = COALESCE(?, project_techstack),
      project_assigned_date = COALESCE(?, project_assigned_date),

      -- ✅ DATE FIELDS
      est_start_date = COALESCE(?, est_start_date),
      est_end_date = COALESCE(?, est_end_date),
      actual_start_date = COALESCE(?, actual_start_date),
      actual_end_date = COALESCE(?, actual_end_date),

      updated_at = NOW()
    WHERE project_id = ?`,
    [
      org_short_name,
      project_name,
      client_name,
      client_location,
      client_contact,
      mng_name,
      mng_email,
      mng_contact,
      project_description,
      project_techstack,
      project_assigned_date,

      est_start_date,
      est_end_date,
      actual_start_date,
      actual_end_date,

      project_id
    ]
  );

  return result;
}


async function deleteProject(project_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM project_master WHERE project_id = ?',
    [project_id]
  );
  return result;
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getProjectByProjectId,
  updateProjectPartially,
  updateProject,
  deleteProject
}