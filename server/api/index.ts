import * as express from 'express';
import authRouter from './auth';
import categoryRouter from './category';
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/category', categoryRouter);

export default apiRouter;
