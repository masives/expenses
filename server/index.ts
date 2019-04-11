import * as express from 'express';
import * as next from 'next';

// to be changed to Node_env
const dev = true;
const APPLICATION_PORT = 3000;
const HOSTNAME = 'localhost';

const app = next({ dev });
const handleByNext = app.getRequestHandler();

app.prepare().then(() => {
  const server: express.Express = express();

  server.get('*', (req, res) => handleByNext(req, res));

  server.listen(APPLICATION_PORT, HOSTNAME, (err: any) => {
    console.log(`Server is listening on host ${HOSTNAME} port ${APPLICATION_PORT}`);

    if (err) {
      throw err;
    }
  });
});
