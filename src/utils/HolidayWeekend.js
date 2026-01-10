/**
 * `SELECT 1 FROM holiday_master WHERE holiday_date = ? `,
 */

//org_holiday_mapping
class HolidayWeekend {
  static async isHoliday(conn, org_short_name, date) {
  const [rows] = await conn.query(
    `SELECT 1
     FROM org_holiday_mapping ohm
     JOIN holiday_master hm ON hm.holiday_id = ohm.holiday_id
     WHERE ohm.org_short_name = ?
     AND hm.holiday_date = ?
     AND ohm.status = 'ACTIVE'`,
    [org_short_name, date]
  );
  return rows.length > 0;
}

  static isWeekend(date, startDay, endDay) {
    const days = [
      'Sunday','Monday','Tuesday',
      'Wednesday','Thursday','Friday','Saturday'
    ];

    const start = days.indexOf(startDay);
    const end = days.indexOf(endDay);

    const workingDays =
      start <= end
        ? days.slice(start, end + 1)
        : [...days.slice(start), ...days.slice(0, end + 1)];

    const givenDay = days[new Date(date).getDay()];
    return !workingDays.includes(givenDay);
  }
}

module.exports = HolidayWeekend;
