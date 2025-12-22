
import {
  createEmpMappedProjModel,
  listEmpMappedProjModel,
  getEmpMappedProjModel
} from '../models/employeeMappedProjectsModel.js';

/**
 * Create employee ↔ project mapping
 */
export const createEmpMappedProj = async (req, res) => {
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
      data: { emp_id,
      project_id,
      mapping_status, result}
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
export const listEmpMappedProj = async (req, res) => {
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
export const getEmpMappedProj = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const projects = await getEmpMappedProjModel(emp_id);

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('getEmpMappedProj error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee projects'
    });
  }
};
