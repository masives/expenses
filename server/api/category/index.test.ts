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
  const populatedCategory = await createdCategory.populate('subcategories').execPopulate();
  await dbConnection.connection.close();
  return populatedCategory;
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

  it("PUT /category/:id should update category and it's  subcategories", async () => {
    // given
    const subcategories = ['rent', 'electricity'];
    const categoryName = 'House';

    const createdCategory = await addTestCategory(categoryName, subcategories);
    const createdCategoryId = createdCategory.id;

    const newCategoryName = 'Home';
    const newSubcategories = ['water', 'internet'];

    const categoryUpdate = {
      name: newCategoryName,
      subcategories: createdCategory.subcategories.map((subcategory, index) => ({
        id: subcategory.id,
        name: newSubcategories[index],
      })),
    };

    // when
    const response = await axios.put(`${apiEndpoint}/category/${createdCategoryId}`, categoryUpdate, {
      headers,
    });

    // then
    expect(response.data).toMatchObject({
      _id: expect.any(String),
      name: newCategoryName,
      subcategories: categoryUpdate.subcategories,
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
