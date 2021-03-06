import * as mongoose from 'mongoose';
import { INewSubcategory, ICreatedSubcategory } from '../../../types/Category';

export interface ISubcategoryModel extends mongoose.Document, ICreatedSubcategory {}

const SubcategorySchema: mongoose.Schema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  userId: {
    ref: 'user',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

export const SubcategoryModel: mongoose.Model<ISubcategoryModel> = mongoose.model('Subcategory', SubcategorySchema);

export const addSubcategory = (subcategory: INewSubcategory[]): Promise<ISubcategoryModel[]> => {
  return SubcategoryModel.create(subcategory);
};

export const updateSubcategory = (
  id,
  subcategoryUpdate
): mongoose.DocumentQuery<ISubcategoryModel | null, ISubcategoryModel, {}> => {
  return SubcategoryModel.findOneAndUpdate({ _id: id }, subcategoryUpdate, { new: true });
};
