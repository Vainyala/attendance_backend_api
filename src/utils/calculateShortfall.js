class CalculateShortfallHrs {
  // async method
  static async calculateShortfall(connection, emp_id, date) {
    const [rows] = await connection.query(
      `SELECT 
         MIN(CASE WHEN att_status='CHECK_IN' THEN att_timestamp END) AS first_checkin,
         MAX(CASE WHEN att_status='CHECK_OUT' THEN att_timestamp END) AS last_checkout
       FROM employee_attendance
       WHERE emp_id = ? AND DATE(att_timestamp) = ?`,
      [emp_id, date]
    );

    const row = rows[0];

    if (!row.first_checkin || !row.last_checkout) return 0;

    const workedHours = (new Date(row.last_checkout) - new Date(row.first_checkin)) / 1000 / 3600;
    const standardHours = 9; // adjust per your org
    return Math.max(0, standardHours - workedHours); // shortfall
  }
}

export default CalculateShortfallHrs;
