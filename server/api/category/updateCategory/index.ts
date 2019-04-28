import * as express from 'express';
import { findCategoryById, updateCategory } from '../../../repository/category';
import { ISubcategoryUpdate, INewSubcategory, ICreatedSubcategory, ICategoryUpdate } from '../../../../types/Category';
import { addSubcategory, updateSubcategory, ISubcategoryModel } from '../../../repository/subcategory';

const findExistingSubcategoriesToBeCreated = async (
  subcategoriesUpdate: ISubcategoryUpdate[],
  userId: string
): Promise<INewSubcategory[]> => {
  return subcategoriesUpdate
    .filter((subcategory) => !subcategory.hasOwnProperty('_id'))
    .map((subcategory) => ({
      name: subcategory.name,
      userId,
    }));
};

const createNewSubcategoriesForUpdate = async (subcategoriesUpdate, userId): Promise<ICreatedSubcategory[]> => {
  const newSubcategories = await findExistingSubcategoriesToBeCreated(subcategoriesUpdate, userId);
  return newSubcategories.length ? await addSubcategory(newSubcategories) : [];
};

const modifyExistingSubcategories = async (
  currentSubcategories: ICreatedSubcategory[],
  subcategoriesUpdate: ISubcategoryUpdate[]
): Promise<(ISubcategoryModel | null)[]> => {
  const existingSubCategories = subcategoriesUpdate.filter((subcategory) =>
    currentSubcategories.some((existingSubcategory) => existingSubcategory.id === subcategory._id)
  );
  return Promise.all(
    existingSubCategories.map((subcategory) => updateSubcategory(subcategory._id, { name: subcategory.name }))
  );
};

const updateSubcategories = async (
  currentSubcategories: ICreatedSubcategory[],
  subcategoriesUpdate: ISubcategoryUpdate[],
  userId: string
): Promise<string[]> => {
  let createdNewSubcategories = await createNewSubcategoriesForUpdate(subcategoriesUpdate, userId);
  await modifyExistingSubcategories(currentSubcategories, subcategoriesUpdate);

  return [
    ...currentSubcategories.map((subcategory) => subcategory.id),
    ...createdNewSubcategories.map((subcategory) => String(subcategory._id)),
  ];
};

const updateCategoryHandler: express.RequestHandler = async (req: express.Request, res: express.Response) => {
  const userId = req.user.userId;
  const categoryId = req.params.id;
  const categoryNameUpdate = req.body.name;
  const subcategoriesUpdate: (ISubcategoryUpdate)[] = req.body.subcategories;

  if (!categoryId && (!categoryNameUpdate && !subcategoriesUpdate)) return res.sendStatus(400);

  const category = await findCategoryById(categoryId);
  if (category === null) return res.sendStatus(404);

  const update: ICategoryUpdate = {
    ...(categoryNameUpdate && { name: categoryNameUpdate }),
    ...(subcategoriesUpdate &&
      subcategoriesUpdate.length && {
        subcategories: await updateSubcategories(category.subcategories, subcategoriesUpdate, userId),
      }),
  };

  const updatedCategory = await updateCategory(categoryId, update);

  return res.status(200).send(updatedCategory);
};

export default updateCategoryHandler;
