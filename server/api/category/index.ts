import * as express from 'express';
import { addCategory, findCategoriesForUser, findCategoryById, updateCategory } from '../../repository/category';

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

categoryRouter.put('/:id', async (req: express.Request, res: express.Response) => {
  const categoryId = req.params.id;
  const categoryNameUpdate = req.body.name;
  const subcategoriesUpdate = req.body.subcategories;

  if (!categoryId && (!categoryNameUpdate && !subcategoriesUpdate)) return res.sendStatus(400);

  const category = await findCategoryById(categoryId);
  if (category === null) return res.sendStatus(404);
  console.log({ category });
  const update: any = {};
  if (categoryNameUpdate) {
    update.name = categoryNameUpdate;
  }

  // jeśli są jakieś subkategorie w update

  // sprawdzić które już istnieją (istniejące i nieistniejące)

  // istniejące zuaktualizować - tutaj nie trzeba zmieniać nic w kategorii bo referencja zostaje

  // nieistniejące stworzyć i dodać do id do tablicy w kategorii
  console.log(update);
  const updatedCategory = await updateCategory(categoryId, update);
  console.log({ updatedCategory });

  return res.status(200).send(updatedCategory);
});

categoryRouter.post('/', async (req: express.Request, res: express.Response) => {
  const userId = req.user.userId;
  const { subcategories, categoryName } = req.body;

  const category = await addCategory(categoryName, subcategories, userId);
  res.status(200).send(category);
});

export default categoryRouter;
