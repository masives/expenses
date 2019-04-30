/* eslint-disable no-console */
import * as mongoose from 'mongoose';

import { addUser } from '../server/repository/user';
import { addSubcategory } from '../server/repository/subcategory';
import { INewSubcategory } from '../types/Category';
import { addCategory } from '../server/repository/category';

const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  TEST_USERNAME,
  TEST_PASSWORD,
  MONGO_SERVICE_HOST,
  MONGODB_PORT_NUMBER,
  MONGO_DATABASE_NAME,
} = process.env;

const subcategories = ['food in work', 'groceries', 'restaurant', 'snack'];

const categoryName = 'food';

(async () => {
  const mongooseConnection = await mongoose.connect(
    `mongodb://${MONGO_SERVICE_HOST}:${MONGODB_PORT_NUMBER}/${MONGO_DATABASE_NAME}`,
    { useNewUrlParser: true }
  );
  mongooseConnection.connection.db.dropDatabase();
  const seededAdminUser = await addUser({ password: String(ADMIN_PASSWORD), username: String(ADMIN_USERNAME) });
  const seededTestUser = await addUser({ password: String(TEST_PASSWORD), username: String(TEST_USERNAME) });
  console.log('seededUser: ', { seededAdminUser, seededTestUser });

  const seededSubcategories = await addSubcategory(
    subcategories.map((name): INewSubcategory => ({ name, userId: seededAdminUser.id }))
  );
  console.log('seededSubcategories: ', seededSubcategories);

  const seededCategory = await addCategory(
    categoryName,
    seededSubcategories.map((subcategory) => subcategory.id),
    seededAdminUser.id
  );
  console.log('seededCategory', seededCategory);

  process.exit(0);
})();
