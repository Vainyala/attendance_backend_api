
const {
    createEmpMappedShiftModel,
    listEmpMappedShiftModel,
    getEmpMappedShiftModel
} = require('../models/employeeMappedShiftsModel.js');
/**
 * Create employee ↔ project mapping
 */
const createEmpMappedShift = async (req, res) => {
    try {
        console.log('body:', req.body);
        const { emp_id, shift_id } = req.body;

        // 🔴 VALIDATION
        if (!emp_id || !shift_id) {
            return res.status(400).json({
                success: false,
                message: 'emp_id and shift_id are required'
            });
        }

        const result = await createEmpMappedShiftModel({
            emp_id,
            shift_id
        });

        return res.status(201).json({
            success: true,
            message: 'Employee Shifts mapped successfully',
            data: {
                emp_id,
                shift_id,
                result
            }
        });

    } catch (error) {
        console.error('createEmpMappedShift error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to map shift'
        });
    }
};


/**
 * List all employee ↔ project mappings
 */
const listEmpMappedShift = async (req, res) => {
    try {
        const data = await listEmpMappedShiftModel();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('listEmpMappedShift error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mappings'
        });
    }
};

/**
 * Get projects by employee ID (USED IN SYNC)
 */
const getEmpMappedShift = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const rows = await getEmpMappedShiftModel(emp_id);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee shift not found'
      });
    }

    const response = rows.map(row => ({
      emp_id: row.emp_id,
      shift_id: row.shift_id,
      org_short_name: row.org_short_name,
      shift_name: row.shift_name,
      shift_start_time: row.shift_start_time,
      shift_end_time: row.shift_end_time,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    console.error('getEmpMappedShift error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch employee shifts'
    });
  }
};



module.exports = {
    createEmpMappedShift,
    listEmpMappedShift,
    getEmpMappedShift
}