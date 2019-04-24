import axios from 'axios';
import * as mongoose from 'mongoose';
import { apiEndpoint, getLoggedInHeaders, getAdminUser } from '../../../test-utils';
import { addSubcategory } from '../../repository/subcategory';
import { addCategory, ICategoryModel } from '../../repository/category';

const establishDbConnection = async (): Promise<typeof mongoose> => {
  const { MONGO_SERVICE_HOST, MONGODB_PORT_NUMBER, MONGO_DATABASE_NAME } = process.env;
  const connection = await mongoose.connect(
    `mongodb://${MONGO_SERVICE_HOST}:${MONGODB_PORT_NUMBER}/${MONGO_DATABASE_NAME}`,
    {
      useNewUrlParser: true,
    }
  );

  return connection;
};

const addTestCategory = async (categoryName: string, subcategories: string[]): Promise<ICategoryModel> => {
  const dbConnection = await establishDbConnection();
  const adminUser = await getAdminUser();
  const addedSubcategories = await addSubcategory(
    subcategories.map((subcategoryName) => ({
      name: subcategoryName,
      userId: adminUser.id,
    }))
  );
  const subcategoriesIds = addedSubcategories.map((subcategory) => subcategory.id);

  const createdCategory = await addCategory(categoryName, subcategoriesIds, adminUser.id);
  await dbConnection.connection.close();
  return createdCategory;
};

describe('Api - category', () => {
  const headers = getLoggedInHeaders();
  // it('GET /category')

  it('GET /category/id should return single category', async () => {
    // given
    const subcategories = ['rent', 'electricity'];
    const categoryName = 'House';

    const createdCategory = await addTestCategory(categoryName, subcategories);

    // when
    const response = await axios.get(`${apiEndpoint}/category/${createdCategory.id}`, {
      headers,
    });

    // expect
    expect(response.data).toMatchObject({
      _id: expect.any(String),
      name: categoryName,
      subcategories: subcategories.map((subcategoryName) => ({
        _id: expect.any(String),
        name: subcategoryName,
      })),
    });
  });

  it('POST /category should create category with subcategories', async () => {
    // given
    const newCategory = { categoryName: 'house', subcategories: ['rent', 'electricity', 'internet'] };

    // when
    const response = await axios.post(`${apiEndpoint}/category`, newCategory, {
      headers,
    });

    // then
    expect(response.data).toMatchObject({
      _id: expect.any(String),
      name: newCategory.categoryName,
      subcategories: newCategory.subcategories.map((subcategoryName) => ({
        _id: expect.any(String),
        name: subcategoryName,
      })),
    });
  });
});
