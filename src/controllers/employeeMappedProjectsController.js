
const {
  createEmpMappedProjModel,
  listEmpMappedProjModel,
  getEmpMappedProjModel
} = require('../models/employeeMappedProjectsModel.js');
const { formatProjects } = require('../utils/projectFormatter');
/**
 * Create employee ↔ project mapping
 */
const createEmpMappedProj = async (req, res) => {
  try {
    console.log('body:', req.body);
    const { emp_id, project_id, mapping_status = 'active' } = req.body;

    // 🔴 VALIDATION
    if (!emp_id || !project_id) {
      return res.status(400).json({
        success: false,
        message: 'emp_id and project_id are required'
      });
    }

    const result = await createEmpMappedProjModel({
      emp_id,
      project_id,
      mapping_status
    });

    return res.status(201).json({
      success: true,
      message: 'Employee project mapped successfully',
      data: {
        emp_id,
        project_id,
        mapping_status, result
      }
    });

  } catch (error) {
    console.error('createEmpMappedProj error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to map project'
    });
  }
};


/**
 * List all employee ↔ project mappings
 */
const listEmpMappedProj = async (req, res) => {
  try {
    const data = await listEmpMappedProjModel();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('listEmpMappedProj error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mappings'
    });
  }
};

/**
 * Get projects by employee ID (USED IN SYNC)
 */
const getEmpMappedProj = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const rows = await getEmpMappedProjModel(emp_id);

    if (!rows || rows.length === 0) {
      return notFound(res, 'Employee Project not found');
    }

    const response = formatProjects(rows);

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    console.error('getEmpMappedProj error:', err);
    return serverError(res);
  }
};



module.exports = {
  createEmpMappedProj,
  listEmpMappedProj,
  getEmpMappedProj
}