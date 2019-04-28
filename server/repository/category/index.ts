import * as mongoose from 'mongoose';
import { ICreatedCategory, ICategoryUpdate } from '../../../types/Category';
import { addSubcategory } from '../subcategory';

export interface ICategoryModel extends mongoose.Document, ICreatedCategory {}

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

export const addCategory = async (
  categoryName: string,
  subcategories: string[],
  userId: string
): Promise<ICategoryModel> => {
  const addedSubcategories = await addSubcategory(
    subcategories.map((subcategoryName) => ({
      name: subcategoryName,
      userId,
    }))
  );
  const subcategoriesIds = addedSubcategories.map((subcategory) => subcategory.id);
  const createdCategory = await CategoryModel.create({ name: categoryName, subcategories: subcategoriesIds, userId });
  const populatedCategory = await createdCategory.populate('subcategories').execPopulate();
  return populatedCategory;
};

export const findCategoriesForUser = (userId: string): mongoose.DocumentQuery<ICategoryModel[], ICategoryModel, {}> =>
  CategoryModel.find({ userId }).populate('subcategories');

export const findCategoryById = (categoryId: string): mongoose.DocumentQuery<ICategoryModel | null, ICategoryModel> =>
  CategoryModel.findById(categoryId).populate('subcategories');

export const appendSubcategory = (categoryId, subcategoryId): mongoose.Query<any> =>
  CategoryModel.updateOne({ _id: categoryId }, { $push: { subcategories: subcategoryId } });

export const updateCategory = async (categoryId: string, update: ICategoryUpdate): Promise<mongoose.Query<any>> =>
  CategoryModel.findOneAndUpdate({ _id: categoryId }, { ...update }, { new: true }).populate('subcategories');
