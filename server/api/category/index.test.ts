import axios from 'axios';
import { apiEndpoint, getLoggedInHeaders } from '../../../test-utils';

describe('api - category', () => {
  const headers = getLoggedInHeaders();
  it('should create category with subcategories', async () => {
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
