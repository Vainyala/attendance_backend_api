const { mariadb } = require('../config/mariadb.js');

 async function getAttSummary(emp_id, startDate, endDate) {
  const [rows] = await mariadb.query(
    `SELECT
      COUNT(*) AS days,
      SUM(att_type = 'Present') AS present,
      SUM(att_type = 'Leave') AS leave_days,
      SUM(att_type = 'Absent') AS absent,
      SUM(att_type = 'Holiday') AS holidays,
      SUM(att_type = 'Weekend') AS weekends,
      SUM(on_time) AS ontime,
      SUM(late) AS late
     FROM attendance_analytics
     WHERE emp_id = ?
       AND att_date BETWEEN ? AND ?`,
    [emp_id, startDate, endDate]
  );

  return rows[0];
}

const getDailyAnalytics = async (req, res) => {
  const { emp_id, date } = req.query;

  const [rows] = await mariadb.query(
    `SELECT
       att_date,
       first_checkin,
       last_checkout,
       worked_hrs,
       shortfall_hrs,
       att_type
     FROM attendance_analytics
     WHERE emp_id=? AND att_date=?
     LIMIT 1`,
    [emp_id, date]
  );

  res.json({ success: true, data: rows[0] || null });
};

module.exports = {
  getAttSummary,
  getDailyAnalytics,
}
