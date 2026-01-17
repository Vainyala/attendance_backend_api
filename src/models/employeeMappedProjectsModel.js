const { mariadb } = require('../config/mariadb.js');

/**
 * Insert mapping
 */

async function createEmpMappedProjModel(project_id, members) {
  const values = members.map(emp_id => [
    emp_id,
    project_id,
    'active'
  ]);

  const [result] = await mariadb.query(
    `
    INSERT INTO employee_mapped_projects
    (emp_id, project_id, mapping_status)
    VALUES ?
    `,
    [values]
  );

  return result;
}


/**
 * List all mappings
 */

async function listEmpMappedProjModel() {
  const [rows] = await mariadb.execute(
    `SELECT * FROM employee_mapped_projects`
  );

  return rows;
}

/**
 * Get active projects by employee ID (JOIN)
 */
async function getEmpMappedProjModel(emp_id) {
  const [rows] = await mariadb.execute(
    `
    SELECT 
      p.*,
      psm.project_site_name,
      psm.project_site_lat,
      psm.project_site_long
    FROM employee_mapped_projects emp
    JOIN project_master p 
      ON emp.project_id = p.project_id
    LEFT JOIN project_site_mapping psm
      ON p.project_id = psm.project_id
    WHERE emp.emp_id = ?
      AND emp.mapping_status = 'active'
    `,
    [emp_id]
  );

  return rows;
}



module.exports = {
  createEmpMappedProjModel,
  listEmpMappedProjModel,
  getEmpMappedProjModel,
}