import * as React from 'react';
import axios from 'axios';
import { NextFunctionComponent, NextContext } from 'next';
import { ICreatedCategory } from 'types/Category';

const Categories: NextFunctionComponent = () => {
  const [categories, setCategories] = React.useState<ICreatedCategory[]>([]);
  React.useEffect(() => {
    // change to getInitialProps
    axios.get('api/category').then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <React.Fragment>
      <div>it works</div>
      {categories.map((category: ICreatedCategory) => {
        return (
          <React.Fragment key={category.id}>
            <h2>{category.name}</h2>
            <h3>subcategories</h3>
            {category.subcategories.map((subcategory) => (
              <li key={subcategory.id}>{subcategory.name}</li>
            ))}
          </React.Fragment>
        );
      })}
      <h1>Add new</h1>
    </React.Fragment>
  );
};

// Categories.getInitialProps = async (ctx: NextContext) => {
//   const categories = await axios.get('api/category');
//   //   console.log(categories);
//   return { categories };
// };

export default Categories;
