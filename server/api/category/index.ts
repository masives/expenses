import * as express from 'express';
import { addCategory, findCategoriesForUser, findCategoryById } from '../../repository/category';
import updateCategoryHandler from './updateCategory';

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

categoryRouter.put('/:id', updateCategoryHandler);

categoryRouter.post('/', async (req: express.Request, res: express.Response) => {
  const userId = req.user.userId;
  const { subcategories, categoryName } = req.body;

  const category = await addCategory(categoryName, subcategories, userId);
  res.status(200).send(category);
});

export default categoryRouter;
