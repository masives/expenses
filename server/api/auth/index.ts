import * as express from 'express';
import { IUser } from '../../../types/User';
import { findUserByUsername } from '../../repository/user';
import { comparePassword } from '../../utils/crypto';
import { generateJWTToken } from '../..//utils/jwt';

const authRouter = express.Router();

authRouter.post('/login', async (req: express.Request, res: express.Response) => {
  const { username, password }: IUser = req.body;
  if (!username || !password) return res.status(400).send('Provide credentials');

  const user = await findUserByUsername(username);

  if (user) {
    const isPasswordMatching = await comparePassword(password, user.password);

    if (!isPasswordMatching) return res.status(401).send('Incorrect credentials');

    const token = generateJWTToken(user.username);

    return res
      .status(200)
      .cookie('jwt', token)
      .send(token);
  }
  return res.status(401).send('Incorrect credentials');
});

export default authRouter;
