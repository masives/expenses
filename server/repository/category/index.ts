import * as mongoose from 'mongoose';
import { ICategory } from '../../../types/Category';

export interface ICategoryModel extends mongoose.Document, ICategory {}

const CategorySchema: mongoose.Schema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  subcategories: [
    {
      ref: 'Subcategory',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  userId: {
    ref: 'user',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

const CategoryModel: mongoose.Model<ICategoryModel> = mongoose.model('categories', CategorySchema);

export const addCategory = (categoryName: string, subcategoryIds: string[], userId: string): Promise<ICategoryModel> =>
  CategoryModel.create({ name: categoryName, subcategories: subcategoryIds, userId });

export const findCategoriesForUser = (userId: string): mongoose.DocumentQuery<ICategoryModel[], ICategoryModel, {}> =>
  CategoryModel.find({ userId }).populate('subcategories');

export const findCategoryById = (categoryId: string): mongoose.DocumentQuery<ICategoryModel | null, ICategoryModel> =>
  CategoryModel.findById(categoryId).populate('subcategories');

export const appendSubcategory = (categoryId, subcategoryId): mongoose.Query<any> =>
  CategoryModel.updateOne({ _id: categoryId }, { $push: { subcategories: subcategoryId } });
