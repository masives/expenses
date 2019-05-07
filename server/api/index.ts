import * as express from 'express';
import authRouter from './auth';
import categoryRouter from './category';
import financialTransactionRouter from './financialTransaction';
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use('/financial-transaction', financialTransactionRouter);

export default apiRouter;
