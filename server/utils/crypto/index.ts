import * as bcrypt from 'bcryptjs';
const { HASH_SALT_ROUNDS } = process.env;

export const hashPassword = (password): string => {
  const salt = bcrypt.genSaltSync(Number(HASH_SALT_ROUNDS));
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (candidatePassword: string, actualPassword: string): Promise<boolean> =>
  bcrypt.compare(candidatePassword, actualPassword);
