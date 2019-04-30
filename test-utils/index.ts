import { IUser } from 'types/User';
import { generateJWTToken } from '../server/utils/jwt';
import { findUserByUsername } from '../server/repository/user';
const { TEST_USERNAME, TEST_PASSWORD } = process.env;

export const apiEndpoint = 'http://expenses_dev:3000/api';

export const seededUser: IUser = {
  password: String(TEST_PASSWORD),
  username: String(TEST_USERNAME),
};

export const getJWTToken = (): string => generateJWTToken(seededUser.username);

export const getLoggedInHeaders = (jwt?: string): { Cookie: string } => ({
  Cookie: `jwt=${jwt ? jwt : getJWTToken()};`,
});

export const getAdminUser = async (): Promise<IUser> => {
  const adminUser = await findUserByUsername(seededUser.username);
  if (adminUser === null) {
    throw new Error("Couldn't find admin user when performing test");
  }
  return adminUser;
};
