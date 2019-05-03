import axios from 'axios';
import { apiEndpoint, getLoggedInHeaders } from '../../../test-utils';
import { ICreatedCategory, ICreatedSubcategory } from 'types/Category';

describe('Api - category', () => {
  const headers = getLoggedInHeaders();

  it('GET /category should return multiple categories', async () => {
    // given
    const newCategory1 = {
      categoryName: 'House',
      subcategories: ['rent', 'electricity', 'internet'],
    };
    const newCategory2 = {
      categoryName: 'Kid',
      subcategories: ['medication', 'clothes'],
    };
    const { data: createdCategory1 } = await axios.post<ICreatedCategory>(`${apiEndpoint}/category`, newCategory1, {
      headers,
    });
    const { data: createdCategory2 } = await axios.post<ICreatedCategory>(`${apiEndpoint}/category`, newCategory2, {
      headers,
    });
    // when
    const response = await axios.get<ICreatedCategory[]>(`${apiEndpoint}/category`, {
      headers,
    });

    // expect
    expect(response.data).toEqual(
      expect.arrayContaining([expect.objectContaining(createdCategory1), expect.objectContaining(createdCategory2)])
    );
  });

  it('GET /category/id should return single category', async () => {
    // given
    const categoryName = 'House';
    const subcategories = ['rent', 'electricity', 'internet'];
    const newCategory = {
      categoryName,
      subcategories,
    };
    const { data: createdCategory } = await axios.post<ICreatedCategory>(`${apiEndpoint}/category`, newCategory, {
      headers,
    });
    // when
    const response = await axios.get<ICreatedCategory>(`${apiEndpoint}/category/${createdCategory._id}`, {
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

  describe('PUT /category/:id ', () => {
    it('should update category name', async () => {
      // given
      const categoryName = 'House';
      const subcategories = ['rent', 'electricity', 'internet'];
      const newCategory = {
        categoryName,
        subcategories,
      };
      const { data: createdCategory } = await axios.post<ICreatedCategory>(`${apiEndpoint}/category`, newCategory, {
        headers,
      });

      // when
      const newCategoryName = 'Home';

      const categoryUpdate = {
        name: newCategoryName,
      };
      const response = await axios.put(`${apiEndpoint}/category/${createdCategory._id}`, categoryUpdate, {
        headers,
      });

      // then
      expect(response.data).toMatchObject({
        _id: createdCategory._id,
        name: newCategoryName,
      });
    });
    it('should update category existing subcategories, add new ones', async () => {
      // given
      const categoryName = 'House';
      const unChangedSubcategoryName = 'rent';
      const changedSubcategoryName = 'electricity';
      const newCategory = {
        categoryName,
        subcategories: [unChangedSubcategoryName, changedSubcategoryName],
      };
      const { data: createdCategory } = await axios.post<ICreatedCategory>(`${apiEndpoint}/category`, newCategory, {
        headers,
      });
      const createdSubcategories = createdCategory.subcategories;
      const categoryNotToBeUpdated = createdSubcategories.find(
        (subcategory) => subcategory.name === unChangedSubcategoryName
      );

      // when
      const newSubcategory = { name: 'water' };
      const updatedCategoryName = 'repairs';
      const categoryToBeUpdated = createdSubcategories.find(
        (subcategory) => subcategory.name === changedSubcategoryName
      );
      const updatedCategory = { ...categoryToBeUpdated, name: updatedCategoryName };

      const categoryUpdate = {
        subcategories: [newSubcategory, updatedCategory],
      };

      const response = await axios.put(`${apiEndpoint}/category/${createdCategory._id}`, categoryUpdate, {
        headers,
      });

      // then
      expect(response.data._id).toEqual(createdCategory._id);
      expect(response.data.subcategories).toEqual(
        expect.arrayContaining([
          expect.objectContaining(newSubcategory),
          expect.objectContaining(categoryNotToBeUpdated as ICreatedSubcategory),
          expect.objectContaining(updatedCategory),
        ])
      );
    });
  });

  describe('POST /category', () => {
    it('should create category with subcategories', async () => {
      // given
      const categoryName = 'House';
      const subcategories = ['rent', 'electricity', 'internet'];
      const newCategory = {
        categoryName,
        subcategories,
      };
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

    it('should return error on lack of name', async () => {
      // given
      const subcategories = ['rent', 'electricity', 'internet'];
      // when
      await axios
        .post(
          `${apiEndpoint}/category`,
          { subcategories },
          {
            headers,
          }
        )
        .catch(({ response }) => {
          // then
          expect(response.status).toEqual(400);
        });
    });

    it('should return error on lack of subcategories', async () => {
      // given
      const categoryName = 'House';
      // when
      await axios
        .post(
          `${apiEndpoint}/category`,
          { categoryName },
          {
            headers,
          }
        )
        .catch(({ response }) => {
          // then
          expect(response.status).toEqual(400);
        });
    });
  });
});
