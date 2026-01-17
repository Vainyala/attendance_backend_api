
// Load bcrypt in CommonJS
const bcrypt = require('bcryptjs');

const password = 'nutan123';

// Generate a hash with 12 salt rounds
bcrypt.hash(password, 12).then(hash => {
  console.log('Password:', password);
  console.log('Hashed Password:', hash);
}).catch(err => {
  console.error('Error hashing password:', err);
});


//sir's method to get hashPassword

/**
 
E:\attendance-backendv1>cd src

E:\attendance-backendv1\src>cd cli

E:\attendance-backendv1\src\cli>node hashPassword.js
Password: nutan123
Hashed Password: $2b$12$npfbcrXu1mEJFfOsYukNX.OgjFAzE9YjIu9BtNYX1wKaLS0qtp3ZO

E:\attendance-backendv1\src\cli>

 */


//vainyala method to get hashPassword

// Generate a Bcrypt hash quickly in Node REPL:
/**
 * to generate hashpassword into cmd run this:
 
E:\attendance-backendv1>node  //step1
Welcome to Node.js v20.13.1.
Type ".help" for more information.
> const bcrypt = require('bcrypt');  //step2
undefined
> const password = 'Techecho@123'; // any password do you want
undefined
> bcrypt.hash(password, 12).then(hash => {console.log('Password:', password, 'Hashed Password:', hash);});
Promise {
  <pending>,
  [Symbol(async_id_symbol)]: 53,
  [Symbol(trigger_async_id_symbol)]: 51
}
> Password: 123456 Hashed Password: $2b$12$hFE3d861kfYopnR0rk9/IefHd0LcmkoMr67/VaOjA49.hUyNmR0Ue
.exitit

 */

