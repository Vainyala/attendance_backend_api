
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
    let { project_id, members } = req.body;

    // normalize members
    if (Array.isArray(members) && typeof members[0] === 'object') {
      members = members.map(m => m.emp_id);
    }

    if (!project_id || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'project_id and members are required'
      });
    }

    const result = await createEmpMappedProjModel(
      project_id,
      members
    );

    return res.status(201).json({
      success: true,
      message: 'Employees mapped to project successfully',
      inserted: result.affectedRows
    });

  } catch (err) {
    console.error('mapEmployeesToProject error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to map employees'
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