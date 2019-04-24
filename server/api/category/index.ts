import * as express from 'express';
import { addCategory, findCategoriesForUser, findCategoryById } from '../../repository/category';
import { addSubcategory } from '../../repository/subcategory';

const categoryRouter = express.Router();

categoryRouter.get('/', async (req: express.Request, res: express.Response) => {
  const userId = req.user.userId;

  const categories = await findCategoriesForUser(userId);

  return res.status(200).send(categories);
});

categoryRouter.get('/:id', async (req: express.Request, res: express.Response) => {
  const categoryId = req.params.id;
  if (!categoryId) return res.sendStatus(400);

  const categories = await findCategoryById(categoryId);

  return res.status(200).send(categories);
});

categoryRouter.post('/', async (req: express.Request, res: express.Response) => {
  const userId = req.user.userId;
  const { subcategories, categoryName } = req.body;

  const addedSubcategories = await addSubcategory(
    subcategories.map((subcategoryName) => ({
      name: subcategoryName,
      userId,
    }))
  );

  const subcategoriesIds = addedSubcategories.map((subcategory) => subcategory.id);

  const categories = await addCategory(categoryName, subcategoriesIds, userId);
  const populatedCategories = await categories.populate('subcategories').execPopulate();
  res.status(200).send(populatedCategories);
});

export default categoryRouter;
