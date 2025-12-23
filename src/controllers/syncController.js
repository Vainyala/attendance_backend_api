import { getEmployeeById } from '../models/employeeModel.js';
import { getEmpMappedProjModel } from '../models/employeeMappedProjectsModel.js';
import { getAttSummary } from '../models/attendanceAnalyticsModel.js';
import { getRegularizationByEmpId } from '../models/regularizationModel.js';
import { generateDailyAnalytics } from '../utils/attendanceAnalyticsService.js';

export const manualSync = async (req, res) => {
  console.log('body:', req.body);

  try {
    const { emp_id } = req.body;

    if (!emp_id) {
      return res.status(400).json({
        success: false,
        message: 'emp_id required'
      });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // ✅ 1. Employee
    const employee = await getEmployeeById(emp_id);

    // ✅ 2. Projects
    const projects = await getEmpMappedProjModel(emp_id);

    // 🔥 3. GENERATE ANALYTICS FOR TODAY
    const today = now.toISOString().slice(0, 10);
    await generateDailyAnalytics(emp_id, today);

    // ✅ 4. READ ANALYTICS
    const summary = await getAttSummary(
      emp_id,
      monthStart,
      monthEnd
    );

    // ✅ 5. Regularization
    const regularization = await getRegularizationByEmpId(emp_id);

    return res.status(200).json({
      success: true,
      data: {
        employee,
        projects,
        attendance_summary: summary,
        regularization
      }
    });

  } catch (error) {
    console.error('manualSync error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sync failed'
    });
  }
};
