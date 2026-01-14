class CalculateShortfallHrs {
  static async calculate(connection, emp_id, date) {
    const [rows] = await connection.query(
      `
      SELECT 
        MIN(CASE WHEN ea.att_status = 'CHECK_IN' THEN ea.att_timestamp END) AS first_checkin,
        MAX(CASE WHEN ea.att_status = 'CHECK_OUT' THEN ea.att_timestamp END) AS last_checkout,
        s.shift_start_time,
        s.shift_end_time
      FROM employee_attendance ea
      JOIN employee_mapped_shifts ems ON ems.emp_id = ea.emp_id
      JOIN shift_master s ON s.shift_id = ems.shift_id
      WHERE ea.emp_id = ?
        AND DATE(ea.att_timestamp) = ?
      `,
      [emp_id, date]
    );

    const row = rows[0];

    if (!row || !row.first_checkin || !row.last_checkout) {
      return {
        first_checkin: null,
        last_checkout: null,
        shortfall_hrs: 0
      };
    }

    // Build shift start & end datetime
    const shiftStart = new Date(`${date} ${row.shift_start_time}`);
    const shiftEnd = new Date(`${date} ${row.shift_end_time}`);

    const actualIn = new Date(row.first_checkin);
    const actualOut = new Date(row.last_checkout);

    // Clamp times
    const effectiveIn = actualIn <= shiftStart ? shiftStart : actualIn;
    const effectiveOut = actualOut >= shiftEnd ? shiftEnd : actualOut;

    let workedHours = 0;
    if (effectiveOut > effectiveIn) {
      workedHours =
        (effectiveOut - effectiveIn) / (1000 * 60 * 60);
    }

    const standardHours =
      (shiftEnd - shiftStart) / (1000 * 60 * 60);

    return {
      first_checkin: row.first_checkin,
      last_checkout: row.last_checkout,
      worked_hours: workedHours,
      shortfall_hrs: Math.max(0, standardHours - workedHours)
    };
  }
}

module.exports = CalculateShortfallHrs;








// class CalculateShortfallHrs {
//   // Read office start time, end time & worked hours
//   static async calculate(connection, emp_id, date) {
//     const [rows] = await connection.query(
//       `
//       SELECT 
//         MIN(CASE WHEN att_status = 'CHECK_IN' THEN att_timestamp END) AS first_checkin,
//         MAX(CASE WHEN att_status = 'CHECK_OUT' THEN att_timestamp END) AS last_checkout
//       FROM employee_attendance
//       WHERE emp_id = ? 
//         AND DATE(att_timestamp) = ?
//       `,
//       [emp_id, date]
//     );

//     const row = rows[0];

//     // If no proper check-in or check-out
//     if (!row || !row.first_checkin || !row.last_checkout) {
//       return {
//         first_checkin: null,
//         last_checkout: null,
//         shortfall_hrs: 0
//       };
//     }

//     const workedHours =
//       (new Date(row.last_checkout) - new Date(row.first_checkin)) / (1000 * 60 * 60);

//     const standardHours = 9;

//     return {
//       first_checkin: row.first_checkin,
//       last_checkout: row.last_checkout,
//       shortfall_hrs: Math.max(0, standardHours - workedHours)
//     };
//   }
// }

// module.exports = CalculateShortfallHrs;
