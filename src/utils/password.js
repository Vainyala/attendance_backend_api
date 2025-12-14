import bcrypt from 'bcrypt';

export async function hashPassword(plain) {
  const saltRounds = 12;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
