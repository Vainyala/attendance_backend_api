// src/routes/usersRoutes.js
const express = require( 'express' );
const { jwtAuth } = require( '../middleware/jwtAuth.js' );
//import { authorize } from '../middleware/authorize.js';
const { getUsersdata, createUserdata, updateUserdata, deleteUserdata, updateUserdataPartially } = 
require( '../controllers/usersController.js' );

const router = express.Router();

//router.use(jwtAuth);

// Protect each route with RBAC privileges
router.get('/', /*authorize('GET:/users'),*/ jwtAuth, getUsersdata);
//router.post('/api/v1/users', authorize('POST:/users'), createUserdata);
router.post('/', createUserdata);
router.put('/:emp_id', /*authorize('PUT:/users/:id'),*/ jwtAuth, updateUserdata);
router.patch('/:emp_id', /*authorize('PUT:/users/:id'),*/ jwtAuth, updateUserdataPartially);
router.delete('/:emp_id', /*authorize('DELETE:/users/:id'),*/ jwtAuth, deleteUserdata);

module.exports = router;
