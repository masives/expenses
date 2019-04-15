import * as bcrypt from 'bcryptjs';
const { HASH_SALT_ROUNDS } = process.env;

export const hashPassword = (password): string => {
  const salt = bcrypt.genSaltSync(HASH_SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (candidatePassword: string, actualPassword: string): boolean =>
  bcrypt.compare(candidatePassword, actualPassword);
