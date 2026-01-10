const { mariadb } = require('../config/mariadb.js');

/**
 * Get org_short_name from emp_id
 * Extracts org_short_name from employee record
 */

async function getOrgShortNameFromEmp(connection, emp_id) {
  if (!emp_id || typeof emp_id !== 'string') {
    throw new Error('Invalid emp_id');
  }

  const [rows] = await connection.query(
    `SELECT org_short_name FROM employee_master WHERE emp_id = ?`,
    [emp_id]
  );

  if (rows.length === 0) {
    throw new Error(`Employee not found with emp_id: ${emp_id}`);
  }

  return rows[0].org_short_name;
}



/**
 * Get org_short_name from project_id
 * Extracts org_short_name from project record
 */

async function getOrgShortNameFromProj(connection, project_id) {
  if (!project_id || typeof project_id !== 'string') {
    throw new Error('Invalid project_id');
  }

  const [rows] = await connection.query(
    `SELECT org_short_name FROM project_master WHERE project_id = ?`,
    [project_id]
  );

  if (rows.length === 0) {
    throw new Error(`Employee not found with project_id: ${project_id}`);
  }

  return rows[0].org_short_name;
}

module.exports = {
  getOrgShortNameFromEmp,
  getOrgShortNameFromProj
}