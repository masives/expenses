import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

const useParsers = (server): void => {
  server.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  server.use(bodyParser.json());
  server.use(cookieParser());
};
export default useParsers;
