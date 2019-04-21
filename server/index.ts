/* eslint-disable no-console */
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as next from 'next';
import * as passport from 'passport';
import useParsers from './middleware/parsers';
import { authenticateWith401Response, authenticateWithRedirect } from './middleware/authentication';
import jwtStrategy from './middleware/authentication/jwtStrategy';
import apiRouter from './api';
import { login } from './api/auth';

const { APPLICATION_PORT, MONGO_SERVICE_HOST, MONGODB_PORT_NUMBER, MONGO_DATABASE_NAME, NODE_ENV } = process.env;

const dev = NODE_ENV === 'development';
const HOSTNAME = '0.0.0.0';

const app = next({ dev });
const handleByNext = app.getRequestHandler();

mongoose
  .connect(`mongodb://${MONGO_SERVICE_HOST}:${MONGODB_PORT_NUMBER}/${MONGO_DATABASE_NAME}`, {
    useNewUrlParser: true,
  })
  .catch((error) => {
    console.log(`mongo error ${error}`);
    process.exit(1);
  });

app.prepare().then(() => {
  const server: express.Express = express();

  // parsers
  useParsers(server);

  // unprotected routes
  server.get('/login', (req, res) => handleByNext(req, res));
  server.post('/api/auth/login', login);
  // unprotected resources
  server.get('/static/*', (req, res) => handleByNext(req, res));
  server.get('/favicon.ico', (req, res) => handleByNext(req, res));
  // dev only
  if (dev) {
    server.get('/_next/*', (req, res) => handleByNext(req, res));
  }

  server.use(passport.initialize());

  passport.use(jwtStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  server.use('/api', authenticateWith401Response, apiRouter);

  server.get('*', authenticateWithRedirect, (req, res) => handleByNext(req, res));

  server.listen(Number(APPLICATION_PORT), HOSTNAME, (err) => {
    console.log(`Server is listening on host ${HOSTNAME} port ${APPLICATION_PORT}`);

    if (err) {
      throw err;
    }
  });
});
