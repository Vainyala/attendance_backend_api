import { getAttSummary } from '../models/attendanceAnalyticsModel.js';
import { generateDailyAnalytics } from '../utils/attendanceAnalyticsService.js';
// import { mariadb } from '../config/mariadb.js';

function getDateRange(type, date) {
  const today = date ? new Date(date) : new Date();
  const yyyyMmDd = d => d.toISOString().slice(0, 10);

  if (type === 'daily') {
    return [yyyyMmDd(today), yyyyMmDd(today)];
  }

  if (type === 'weekly') {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return [yyyyMmDd(start), yyyyMmDd(today)];
  }

  if (type === 'monthly' || type === 'quarterly') {
    const day = today.getDate();
    const monthOffset = day <= 5 ? 3 : 2;

    const start = new Date(
      today.getFullYear(),
      today.getMonth() - monthOffset,
      1
    );

    return [yyyyMmDd(start), yyyyMmDd(today)];
  }

  return null;
}



export const getSummary = async (req, res) => {
  console.log("Employee data called: ", req.params);
  try {
    const { emp_id, type, date } = req.query;

    const range = getDateRange(type, date);
    if (!range) {
      return res.status(400).json({ success: false });
    }

    const [startDate, endDate] = range;
    const summary = await getAttSummary(emp_id, startDate, endDate);

    res.json({ success: true, data: summary });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

export const generateAnalytics = async (req, res) => {
  const { emp_id, org_id, date } = req.body;

  await generateDailyAnalytics(emp_id, org_id, date);

  res.json({
    success: true,
    message: 'Attendance Analytics created successfully'
  });
};


