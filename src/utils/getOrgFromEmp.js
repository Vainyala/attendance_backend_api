import { mariadb } from '../config/mariadb.js';

export async function getOrgIdFromEmp(emp_id) {
    const [rows] = await mariadb.query(
        `SELECT org_id FROM employee_master WHERE emp_id = ?`,
        [emp_id]
    );

    if (!rows.length) {
        throw new Error('Invalid emp_id: employee not found');
    }

    return rows[0].org_id;
}
