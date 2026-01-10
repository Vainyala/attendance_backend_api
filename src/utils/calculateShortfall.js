class CalculateShortfallHrs {
  // Read office start time, end time & worked hours
  static async calculate(connection, emp_id, date) {
    const [rows] = await connection.query(
      `
      SELECT 
        MIN(CASE WHEN att_status = 'CHECK_IN' THEN att_timestamp END) AS first_checkin,
        MAX(CASE WHEN att_status = 'CHECK_OUT' THEN att_timestamp END) AS last_checkout
      FROM employee_attendance
      WHERE emp_id = ? 
        AND DATE(att_timestamp) = ?
      `,
      [emp_id, date]
    );

    const row = rows[0];

    // If no proper check-in or check-out
    if (!row || !row.first_checkin || !row.last_checkout) {
      return {
        first_checkin: null,
        last_checkout: null,
        shortfall_hrs: 0
      };
    }

    const workedHours =
      (new Date(row.last_checkout) - new Date(row.first_checkin)) / (1000 * 60 * 60);

    const standardHours = 9;

    return {
      first_checkin: row.first_checkin,
      last_checkout: row.last_checkout,
      shortfall_hrs: Math.max(0, standardHours - workedHours)
    };
  }
}

module.exports = CalculateShortfallHrs;
