import { ObjectID } from 'bson';

export type FinancialTransationType = 'EXPENSE' | 'INCOME' | 'SAVING';

export interface INewFinancialTransaction {
  date?: Date;
  subcategory?: ObjectID;
  value: number;
  type: FinancialTransationType;
}

export interface ICreatedFinancialTransaction {
  _id: any;
  id?: any;
  date: Date;
  subcategoryId?: string;
  value: number;
  type: FinancialTransationType;
  userId: string;
}
