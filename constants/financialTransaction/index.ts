import { FinancialTransationType } from 'types/FinancialTransaction';

export const FINANCIAL_TRANSACTION_TYPES: { [s: string]: FinancialTransationType } = {
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME',
  SAVING: 'SAVING',
};
