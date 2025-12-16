import SerialNumberGenerator from '../utils/serialGenerator.js';
import { getOrgIdFromEmp } from '../utils/getOrgFromEmp.js';

export function autoGenerateId(dataType) {
    return async (req, res, next) => {
        try {
            // Get org_id from different sources
            let org_id = req.body.org_id || req.user?.org_id;

            // ⭐ If org_id NOT provided, derive from emp_id
            if (!org_id && req.body.emp_id) {
                org_id = await getOrgIdFromEmp(req.body.emp_id);
                req.body.org_id = org_id; // attach for later use
            }

            if (!org_id) {
                return res.status(400).json({
                    success: false,
                    message: 'org_id could not be resolved'
                });
            }

            // Generate the ID
            const generatedId = await SerialNumberGenerator.generateSerialNumber(org_id, dataType);
            
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