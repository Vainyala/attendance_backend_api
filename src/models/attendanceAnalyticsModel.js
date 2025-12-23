import { mariadb } from '../config/mariadb.js';

export async function getAttSummary(emp_id, startDate, endDate) {
  const [rows] = await mariadb.query(
    `SELECT
      COUNT(*) AS days,
      SUM(att_type = 'Present') AS present,
      SUM(att_type = 'Leave') AS leave_count,
      SUM(att_type = 'Absent') AS absent,
      SUM(on_time = 1) AS on_time,
      SUM(late = 1) AS late
     FROM attendance_analytics
     WHERE emp_id = ?
       AND att_date BETWEEN ? AND ?`,
    [emp_id, startDate, endDate]
  );

  return rows[0];
}


