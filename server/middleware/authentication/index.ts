import * as passport from 'passport';
import * as express from 'express';

export const authenticateWith401Response: express.RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', (authenticateError, user) => {
    if (authenticateError) {
      return next(authenticateError);
    }

    if (!user) {
      return res.status(401).json({});
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return next();
    });
  })(req, res, next);
};

export const authenticateWithRedirect = passport.authenticate('jwt', {
  failureRedirect: '/login',
  session: false,
});
