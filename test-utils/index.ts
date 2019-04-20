import { IUser } from 'types/User';

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

export const apiEndpoint = 'http://expenses_dev:3000/';

export const seededUser: IUser = {
  password: ADMIN_PASSWORD || '',
  username: ADMIN_USERNAME || '',
};
