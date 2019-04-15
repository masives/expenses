import * as express from 'express';
import * as mongoose from 'mongoose';
import * as next from 'next';
import apiRouter from './api';
import useParsers from './middleware/parsers';

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
  useParsers(server);

  server.use('/api', apiRouter);

  server.get('*', (req, res) => handleByNext(req, res));

  server.listen(Number(APPLICATION_PORT), HOSTNAME, (err: any) => {
    console.log(`Server is listening on host ${HOSTNAME} port ${APPLICATION_PORT}`);

    if (err) {
      throw err;
    }
  });
});
