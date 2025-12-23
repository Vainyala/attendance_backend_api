import { mariadb } from '../config/mariadb.js';
import CalculateShortfallHrs from '../utils/calculateShortfall.js';
import { getRegularizationByEmpId } from '../models/regularizationModel.js';

export async function generateDailyAnalytics(emp_id, date) {
    console.log('body:', );
  const conn = await mariadb.getConnection();

  try {
    // 1️⃣ Check if leave applied
    const regularization = await getRegularizationByEmpId(emp_id);
    const leaveApplied =
      regularization &&
      regularization.reg_applied_for_date &&
      new Date(regularization.reg_applied_for_date).toISOString().slice(0, 10) === date;

    // 2️⃣ Calculate attendance hours
    const result = await CalculateShortfallHrs.calculate(conn, emp_id, date);

    let att_type = 'Absent';
    let on_time = 0;
    let late = 0;
    let worked_hrs = 0;

    if (leaveApplied) {
      att_type = 'Leave';
    } else if (result.first_checkin && result.last_checkout) {
      att_type = 'Present';

      worked_hrs =
        (new Date(result.last_checkout) - new Date(result.first_checkin)) / 3600000;

      const officeStart = new Date(`${date}T09:30:00`);

      if (new Date(result.first_checkin) <= officeStart) {
        on_time = 1;
      } else {
        late = 1;
      }
    }

    // 3️⃣ Insert / Update analytics
    await conn.query(
      `INSERT INTO attendance_analytics
       (emp_id, att_date, att_type, first_checkin, last_checkout, worked_hrs, shortfall_hrs, on_time, late)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         att_type=VALUES(att_type),
         worked_hrs=VALUES(worked_hrs),
         shortfall_hrs=VALUES(shortfall_hrs),
         on_time=VALUES(on_time),
         late=VALUES(late)`,
      [
        emp_id,
        date,
        att_type,
        result.first_checkin,
        result.last_checkout,
        worked_hrs,
        result.shortfall_hrs,
        on_time,
        late
      ]
    );

  } finally {
    conn.release();
  }
}
