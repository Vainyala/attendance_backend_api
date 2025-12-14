import { mariadb } from '../config/mariadb.js';

export async function createEmployee(data) {
  const {
    emp_id, org_id, emp_name, emp_email, emp_role, 
    emp_department,
    emp_phone, emp_status
  } = data;

  const [result] = await mariadb.execute(
    `INSERT INTO employee_master (
      emp_id, org_id, emp_name, emp_email, emp_role, emp_department,
      emp_phone, emp_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emp_id, org_id, emp_name, emp_email, emp_role, emp_department,
      emp_phone, emp_status
    ]
  );
  return result;
}

export async function getEmployee() {
  const [rows] = await mariadb.execute('SELECT * FROM employee_master');
  return rows;
}

export async function getEmployeeById(emp_id) {
  const [rows] = await mariadb.execute(
    'SELECT * FROM employee_master WHERE emp_id = ? LIMIT 1',
    [emp_id]
  );
  return rows[0] || null;
}

export async function updateEmployee(emp_id, data) {
 const {
   org_id = null, emp_name= null, emp_email= null, emp_role= null, emp_department= null,
    emp_phone= null, emp_status= null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_master SET
      org_id = ?, emp_name = ?, emp_email = ?, emp_role = ?, emp_department = ?,
      emp_phone = ?, emp_status = ?
    WHERE emp_id = ?`,
    [
      org_id, emp_name, emp_email, emp_role, emp_department,
      emp_phone, emp_status,
      emp_id
    ]
  );
  return result;
}

export async function updateEmployeePartial(emp_id, data) {
  const {
    org_id = null,
    emp_name = null,
    emp_email = null,
    emp_role = null,
    emp_department = null,
    emp_phone = null,
    emp_status = null
  } = data;

  const [result] = await mariadb.execute(
    `UPDATE employee_master SET
      org_id = COALESCE(?, org_id),
      emp_name = COALESCE(?, emp_name),
      emp_email = COALESCE(?, emp_email),
      emp_role = COALESCE(?, emp_role),
      emp_department = COALESCE(?, emp_department),
      emp_phone = COALESCE(?, emp_phone),
      emp_status = COALESCE(?, emp_status)
     WHERE emp_id = ?`,
    [
      org_id,
      emp_name,
      emp_email,
      emp_role,
      emp_department,
      emp_phone,
      emp_status,
      emp_id
    ]
  );

  return result;
}



export async function deleteEmployee(emp_id) {
  const [result] = await mariadb.execute(
    'DELETE FROM employee_master WHERE emp_id = ?',
    [emp_id]
  );
  return result;
}
