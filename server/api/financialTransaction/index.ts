import * as express from 'express';
import { from } from 'rxjs';
import { addFinancialTransaction } from '../../repository/financialTransaction';

const financialTransactionRouter = express.Router();

financialTransactionRouter.post('/', (req, res) => {
  const newFinancialTransaction = req.body;
  const userId = req.user.userId;
  const addFinancialTransaction$ = from(addFinancialTransaction({ ...newFinancialTransaction, userId }));
  addFinancialTransaction$.subscribe({
    error: (err) => res.status(400).send(err),
    next: (financialTransaction) => res.status(200).send(financialTransaction),
  });
});

export default financialTransactionRouter;
