const { getEmployeeById } = require('../models/employeeModel.js');
const { getEmpMappedProjModel } = require('../models/employeeMappedProjectsModel.js');
const { getAttSummary } = require('../models/attendanceAnalyticsModel.js');
const { getRegularizationByEmpId } = require('../models/regularizationModel.js');
const { generateDailyAnalytics } = require('../utils/attendanceAnalyticsService.js');
const { getLeavesByEmpId } = require('../models/leavesModel.js');
const { formatProjects } = require('../utils/projectFormatter');

const manualSync = async (req, res) => {
  try {
    const { emp_id } = req.body;

    if (!emp_id) {
      return res.status(400).json({
        success: false,
        message: 'emp_id required'
      });
    }

    const now = new Date();
    const year = now.getFullYear();

    // ✅ Month start & end
    const monthStart = new Date(year, now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const monthEnd = new Date(year, now.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);

    // ✅ 1. Employee details
    const employee = await getEmployeeById(emp_id);

    // Optional safety check
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // ✅ 2. Mapped projects
    const projectRows = await getEmpMappedProjModel(emp_id);
 const projects = formatProjects(projectRows);
    // ✅ 3. Generate today's analytics
    const today = now.toISOString().slice(0, 10);
    await generateDailyAnalytics(emp_id, today);

    // ✅ 4. Attendance summary
    const summary = await getAttSummary(emp_id, monthStart, monthEnd);

    // ✅ 5. Regularization
    const regularization = await getRegularizationByEmpId(emp_id);
    // ✅ 6. Leaves
    const leaves = await getLeavesByEmpId(emp_id);

    return res.status(200).json({
      success: true,
      data: {
        employee,
        projects,
        attendance_summary: summary,
        regularization,
        leaves
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

module.exports = manualSync;
