import * as jwt from 'jsonwebtoken';
import { DAY } from '../../../constants';

const { JWT_SECRET } = process.env;

export const generateJWTToken = (username: string): string =>
  jwt.sign({ username }, String(JWT_SECRET), {
    expiresIn: DAY,
  });
