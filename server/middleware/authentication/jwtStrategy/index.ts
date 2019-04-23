import * as passportJwt from 'passport-jwt';
import { findUserByUsername, IUserModel } from '../../../repository/user';

const { ADMIN_USERNAME } = process.env;

const { ExtractJwt, Strategy } = passportJwt;

const { JWT_SECRET } = process.env;

const options: passportJwt.StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt || null]),
  secretOrKey: JWT_SECRET,
};

const jwtStrategy: passportJwt.Strategy = new Strategy(options, async (jwtPayload, done) => {
  const { username } = jwtPayload;
  const user: IUserModel | null = await findUserByUsername(username);

  return user
    ? done(null, {
        isAdministrator: user.username === ADMIN_USERNAME,
        userId: user.id,
        username,
      })
    : done(null, false);
});

export default jwtStrategy;
