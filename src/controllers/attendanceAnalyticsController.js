import { getAttSummary } from '../models/attendanceAnalyticsModel.js';
import { generateDailyAnalytics } from '../utils/attendanceAnalyticsService.js';

function getDateRange(type, date) {
  if (!type || !date) return null;

  const d = new Date(date);
  if (isNaN(d)) return null;

  if (type === 'daily') {
    return [date, date];
  }

  if (type === 'weekly') {
    const start = new Date(d);
    start.setDate(d.getDate() - 6);
    return [
      start.toISOString().slice(0, 10),
      d.toISOString().slice(0, 10)
    ];
  }

  if (type === 'monthly') {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return [
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10)
    ];
  }

  if (type === 'quarterly') {
    const q = Math.floor(d.getMonth() / 3);
    const start = new Date(d.getFullYear(), q * 3, 1);
    const end = new Date(d.getFullYear(), q * 3 + 3, 0);
    return [
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10)
    ];
  }

  return null;
}


export const getSummary = async (req, res) => {
  try {
    const { emp_id, type, date } = req.query;

    const range = getDateRange(type, date);
    if (!range) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type or date'
      });
    }

    const [startDate, endDate] = range;

    const summary = await getAttSummary(emp_id, startDate, endDate);

    res.json({ success: true, data: summary });

  } catch (e) {
    console.error('error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const generateAnalytics = async (req, res) => {
  const { emp_id, date } = req.body;
  await generateDailyAnalytics(emp_id, date);
  res.json({ success: true,
    message: 'Attendance Analytics created successfully' });
};
