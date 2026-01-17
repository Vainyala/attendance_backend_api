
// src/controllers/usersController.js
const { ok, badRequest, notFound, serverError } = require ( '../utils/response.js' );
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPartially
} = require ( '../models/usersModel.js' );


/**
 * GET /api/v1/users
 */
async function getUsersdata(req, res) {
  try {
    const users = await getAllUsers();
    return ok(res, { users });
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * POST /api/v1/users
 */
async function createUserdata(req, res) {
  console.log('usersController: createUserdata: ', req.body);

  const { emp_id, email_id, password, mpin } = req.body || {};
  if (!emp_id || !email_id || !password) {
    return badRequest(res, 'emp_id, email_id and password are required');
  }

  try {
    await createUser({ emp_id, email_id, password, mpin });
    return ok(res, { message: 'User created', emp_id });
  } catch (err) {
    return serverError(res, err.message);
  }
}

/**
 * PUT /api/v1/users/:emp_id
 */
async function updateUserdata(req, res) {
  console.log('body: ', req.body);
  const { emp_id } = req.params;
  const { email_id, password, mpin, emp_status } = req.body || {};
  // 🚫 If someone tries to send emp_id in body
  if ('emp_id' in req.body) {
    return badRequest(res, 'emp_id cannot be updated');
  }
  if (!emp_id) return badRequest(res, 'User id required');

  try {
    const result = await updateUser(emp_id, { email_id, password, mpin, emp_status });
    if (result.affectedRows === 0) return notFound(res, `User ${emp_id} not found`);
    return ok(res, { message: `User ${emp_id} updated` });
  } catch (err) {
    console.log('error: ', err);
    return serverError(res, err.message);
  }
}

/**
 * PATCH /api/v1/users/:emp_id
 */
async function updateUserdataPartially(req, res) {
  console.log('body:', req.body);

  const { emp_id } = req.params;
  let { email_id, password, mpin, emp_status } = req.body || {};

  // 🚫 If someone tries to send emp_id in body
  if ('emp_id' in req.body) {
    return badRequest(res, 'emp_id cannot be updated');
  }

  if (!emp_id) return badRequest(res, 'emp_id is required');

  if (!email_id && !password && !mpin && !emp_status) {
    return badRequest(res, 'At least one field must be provided');
  }
   // ✅ Convert undefined → null
   email_id   = email_id   ?? null;
   password   = password   ?? null;
   mpin       = mpin       ?? null;
   emp_status = emp_status ?? null;

  try {
    const result = await updateUserPartially(emp_id, {
      email_id,
      password,
      mpin,
      emp_status
    });

    if (result.affectedRows === 0) {
      return notFound(res, `User ${emp_id} not found`);
    }

    return ok(res, { message: `User ${emp_id} updated successfully` });
  } catch (err) {
    console.log('error : ', err);
    return serverError(res, err.message);
  }
}


/**
 * DELETE /api/v1/users/:id
 */
async function deleteUserdata(req, res) {
  const { emp_id } = req.params;
  if (!emp_id) return badRequest(res, 'User id required');

  try {
    const result = await deleteUser(emp_id);
    if (result.affectedRows === 0) return notFound(res, `User ${emp_id} not found`);
    return ok(res, { message: `User ${emp_id} deleted` });
  } catch (err) {
    console.log('error : ', err);
    return serverError(res, err.message);
  }
}

module.exports = {
  deleteUserdata,
  updateUserdata,
  createUserdata,
  updateUserdataPartially,
  getUsersdata
}