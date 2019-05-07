import axios from 'axios';
import * as mongoose from 'mongoose';
import { apiEndpoint, getLoggedInHeaders } from '../../../test-utils';
import { INewFinancialTransaction } from '../../../types/FinancialTransaction';
import { FINANCIAL_TRANSACTION_TYPES } from '../../../constants/financialTransaction';

const financialTransactionEndpoint = `${apiEndpoint}/financial-transaction`;
// const newId2 = new mongoose.mongo.ObjectId();
describe('Api - financial-transaction', () => {
  const headers = getLoggedInHeaders();

  // other tests
  //

  describe('POST /financial-transaction should create entry', () => {
    it('for expense', async () => {
      // given
      const newFinancialTransaction: INewFinancialTransaction = {
        subcategory: new mongoose.mongo.ObjectId(),
        type: FINANCIAL_TRANSACTION_TYPES.EXPENSE,
        value: 12,
      };

      // when
      const response = await axios.post(financialTransactionEndpoint, newFinancialTransaction, { headers });

      // then
      expect(response.status).toEqual(200);
      expect(response.data).toMatchObject({
        _id: expect.any(String),
        date: expect.any(String),
        subcategory: expect.any(String),
        type: newFinancialTransaction.type,
        userId: expect.any(String),
        value: newFinancialTransaction.value,
      });
    });
    it('for income', async () => {
      // given
      const newFinancialTransaction: INewFinancialTransaction = {
        type: FINANCIAL_TRANSACTION_TYPES.INCOME,
        value: 12,
      };

      // when
      const response = await axios.post(financialTransactionEndpoint, newFinancialTransaction, { headers });

      // then
      expect(response.status).toEqual(200);
      expect(response.data).toMatchObject({
        _id: expect.any(String),
        date: expect.any(String),
        type: newFinancialTransaction.type,
        userId: expect.any(String),
        value: newFinancialTransaction.value,
      });
    });
  });

  describe('GET /financial-transaction should return entries', () => {
    it('for expenses', async () => {
      // given
      const newExpense1: INewFinancialTransaction = {
        subcategory: new mongoose.mongo.ObjectId(),
        type: FINANCIAL_TRANSACTION_TYPES.EXPENSE,
        value: 12,
      };
      const newExpense2: INewFinancialTransaction = {
        subcategory: new mongoose.mongo.ObjectId(),
        type: FINANCIAL_TRANSACTION_TYPES.EXPENSE,
        value: 15,
      };
      const { data: createdExpense1 } = await axios.post(financialTransactionEndpoint, newExpense1, {
        headers,
      });
      const { data: createdExpense2 } = await axios.post(financialTransactionEndpoint, newExpense2, {
        headers,
      });

      // when
      const response = await axios.get(financialTransactionEndpoint, { headers });

      // then
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.arrayContaining([createdExpense1, createdExpense2]));
    });
    // it('for incomes', async () => {
    //   // given
    //   const newFinancialTransaction: INewFinancialTransaction = {
    //     type: FINANCIAL_TRANSACTION_TYPES.INCOME,
    //     value: 12,
    //   };

    //   // when
    //   const response = await axios.post(financialTransactionEndpoint, newFinancialTransaction, { headers });

    //   // then
    //   expect(response.status).toEqual(200);
    //   expect(response.data).toMatchObject({
    //     _id: expect.any(String),
    //     date: expect.any(String),
    //     type: newFinancialTransaction.type,
    //     userId: expect.any(String),
    //     value: newFinancialTransaction.value,
    //   });
    // });
  });
});
