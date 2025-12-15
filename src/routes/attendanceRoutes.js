import express from 'express';
import { jwtAuth } from '../middleware/jwtAuth.js';
import { createAtt, listAtt, getAtt, 
    // updateAtt, updateAttPartially, deleteAtt 
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/',  createAtt);
router.get('/',  listAtt);
router.get('/:att_id',  getAtt);
// router.put('/:att_id',  updateAtt);
// router.patch('/:att_id',  updateAttPartially);
// router.delete('/:att_id', deleteAtt);

export default router;
