const { mariadb } = require('../config/mariadb.js');

/**
 * Insert mapping
 */
async function createEmpMappedProjModel(data) {
  const { emp_id, project_id, mapping_status } = data;

  if (!emp_id || !project_id) {
    throw new Error('emp_id or project_id missing');
  }

  const [result] = await mariadb.execute(
    `
    INSERT INTO employee_mapped_projects
    (emp_id, project_id, mapping_status)
    VALUES (?, ?, ?)`,
    [emp_id, project_id, mapping_status]
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