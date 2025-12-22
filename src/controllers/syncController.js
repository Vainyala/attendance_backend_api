import { getEmployeeById } from '../models/employeeModel.js';
import { getEmpMappedProjModel } from '../models/employeeMappedProjectsModel.js';
import { getAttendanceByEmpId } from '../models/attendanceModel.js';
import { getRegularizationByEmpId } from '../models/regularizationModel.js';


export const manualSync = async (req, res) => {
  console.log('body:', req.body);

  try {
    const { emp_id } = req.body;

    // 1. Employee
    const employee = await getEmployeeById(emp_id);//done

    // 2. Projects mapped to employee
    const projects = await getEmpMappedProjModel(emp_id);//done

    // 3. Attendance
    const attendance = await getAttendanceByEmpId(emp_id);

    // 4. Regularization
    const regularization = await getRegularizationByEmpId(emp_id);

    return res.status(200).json({
      success: true,
      data: {
        employee,
        projects,
        attendance,
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

