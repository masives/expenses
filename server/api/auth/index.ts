import * as express from 'express';
import { IUser } from '../../../types/User';
import { findUserByUsername } from '../../repository/user';
import { comparePassword } from '../../utils/crypto';
import { generateJWTToken } from '../..//utils/jwt';

export const ERRORS = {
  PROVIDE_CREDENTIALS: 'Provide credentials',
  INCORRECT_CREDENTIALS: 'Incorrect credentials',
};

const authRouter = express.Router();

authRouter.post('/login', async (req: express.Request, res: express.Response) => {
  const { username, password }: IUser = req.body;
  if (!username || !password) return res.status(400).send(ERRORS.PROVIDE_CREDENTIALS);

  const user = await findUserByUsername(username);

  if (user) {
    const isPasswordMatching = await comparePassword(password, user.password);

    if (!isPasswordMatching) return res.status(401).send(ERRORS.INCORRECT_CREDENTIALS);

    const token = generateJWTToken(user.username);

    return res
      .status(200)
      .cookie('jwt', token)
      .send(token);
  }
  return res.status(401).send(ERRORS.INCORRECT_CREDENTIALS);
});

export default authRouter;
