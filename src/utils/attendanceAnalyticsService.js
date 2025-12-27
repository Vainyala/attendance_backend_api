import { mariadb } from '../config/mariadb.js';
import CalculateShortfallHrs from '../utils/calculateShortfall.js';
import { getRegularizationByEmpId } from '../models/regularizationModel.js';
import HolidayWeekend from '../utils/HolidayWeekend.js';
import { getOrgShortNameFromEmp } from '../utils/getOrgShortNameFromEmp.js';

export async function generateDailyAnalytics(emp_id, date) {
  const conn = await mariadb.getConnection();

  try {
    // 1️⃣ Get org_short_name from emp_id
    const org_short_name = await getOrgShortNameFromEmp(conn, emp_id);

    // 2️⃣ Get org working days
    const [[org]] = await conn.query(
      `SELECT office_working_start_day, office_working_end_day
   FROM organization_master
   WHERE org_short_name=?`,
      [org_short_name]
    );

    if (!org) {
      throw new Error('Organization config not found');
    }

    // 3️⃣ Checks
    const holiday = await HolidayWeekend.isHoliday(
      conn,
      org_short_name,
      date
    );

    const weekend = HolidayWeekend.isWeekend(
      date,
      org.office_working_start_day,
      org.office_working_end_day
    );

    const leave = await getRegularizationByEmpId(emp_id, date);
    const attendance = await CalculateShortfallHrs.calculate(conn, emp_id, date);

    // 4️⃣ Attendance logic
    let att_type = 'Absent';
    let on_time = 0;
    let late = 0;
    let worked_hrs = 0;

    if (holiday) {
      att_type = 'Holiday';
    } else if (weekend) {
      att_type = 'Weekend';
    } else if (leave) {
      att_type = 'Leave';
    } else if (attendance.first_checkin && attendance.last_checkout) {
      att_type = 'Present';

      worked_hrs =
        (new Date(attendance.last_checkout) -
          new Date(attendance.first_checkin)) / 3600000;

      const officeStart = new Date(`${date}T09:30:00`);
      new Date(attendance.first_checkin) <= officeStart
        ? (on_time = 1)
        : (late = 1);
    }

    // 5️⃣ Insert analytics
    await conn.query(
      `INSERT INTO attendance_analytics
       (emp_id, att_date, att_type, first_checkin, last_checkout,
        worked_hrs, shortfall_hrs, on_time, late)
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
        attendance.first_checkin,
        attendance.last_checkout,
        worked_hrs,
        attendance.shortfall_hrs,
        on_time,
        late
      ]
    );
  } finally {
    conn.release();
  }
}

