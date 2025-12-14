// Generate a Bcrypt hash quickly in Node REPL:

import bcrypt from 'bcrypt';
const password = '123456';
bcrypt.hash(password, 12).then(hash => {
   console.log('Password:', password, 'Hashed Password:', hash);
});
