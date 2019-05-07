import * as mongoose from 'mongoose';
import { ICreatedFinancialTransaction, INewFinancialTransaction } from '../../../types/FinancialTransaction';

export interface IFinancialTransactionModel extends mongoose.Document, ICreatedFinancialTransaction {}

const FinancialTransactionSchema: mongoose.Schema = new mongoose.Schema({
  date: {
    default: Date.now,
    required: true,
    type: Date,
  },
  subcategory: {
    ref: 'SubFinancialTransaction',
    required() {
      return (this as INewFinancialTransaction).type === 'EXPENSE';
    },
    type: mongoose.Schema.Types.ObjectId,
  },
  type: {
    enum: ['EXPENSE', 'INCOME', 'SAVING'],
    required: true,
    type: String,
  },
  userId: {
    ref: 'user',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  value: {
    required: true,
    type: Number,
  },
});

const FinancialTransactionModel: mongoose.Model<IFinancialTransactionModel> = mongoose.model(
  'financialTransactions',
  FinancialTransactionSchema
);

export const addFinancialTransaction = async (
  newFinancialTransaction: INewFinancialTransaction
): Promise<IFinancialTransactionModel> => {
  return FinancialTransactionModel.create(newFinancialTransaction);
};
