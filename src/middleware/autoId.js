import SerialNumberGenerator from '../utils/serialGenerator.js';
import { getOrgShortNameFromEmp } from '../utils/getOrgShortNameFromEmp.js';

export function autoGenerateId(dataType) {
  return async (req, res, next) => {
    try {
      // Get org_short_name from different sources
      let org_short_name = req.body.org_short_name || req.user?.org_short_name;

      const connection = await mariadb.getConnection();
      try {
        org_short_name = await getOrgShortNameFromEmp(connection, req.body.emp_id);
      } finally {
        connection.release();
      }


      if (!org_short_name) {
        return res.status(400).json({
          success: false,
          message: 'org_short_name could not be resolved'
        });
      }

      // Generate the ID (will only increment if entire request succeeds)
      const generatedId = await SerialNumberGenerator.generateSerialNumber(
        org_short_name,
        dataType
      );

      // Attach generated ID to request body
      req.body[`${dataType}_id`] = generatedId;

      console.log(`Generated ${dataType}_id:`, generatedId);
      next();
    } catch (error) {
      console.error('Error generating ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate ID',
        error: error.message
      });
    }
  };
}