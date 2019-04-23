import { IUser } from 'types/User';
import { generateJWTToken } from '../server/utils/jwt';
const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

export const apiEndpoint = 'http://expenses_dev:3000/api';

export const seededUser: IUser = {
  password: ADMIN_PASSWORD || '',
  username: ADMIN_USERNAME || '',
};

export const getLoggedInHeaders = (): { Cookie: string } => {
  const jwt = generateJWTToken(String(process.env.ADMIN_USERNAME));
  return { Cookie: `jwt=${jwt};` };
};
