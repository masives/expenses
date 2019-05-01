import * as React from 'react';
import axios from 'axios';
import { NextFunctionComponent, NextContext } from 'next';
import Link from 'next/link';
import { ICreatedCategory } from '../../types/Category';

const Categories: NextFunctionComponent = () => {
  const [categories, setCategories] = React.useState<ICreatedCategory[]>([]);
  React.useEffect(() => {
    // change to getInitialProps
    axios.get('api/category').then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <section>
      <Link href="/category/add">
        <a>Add new category</a>
      </Link>
      <h1>Categories</h1>
      {categories.map((category: ICreatedCategory) => (
        <div key={category._id}>
          <h2>{category.name}</h2>
          <h3>subcategories</h3>
          {category.subcategories.map((subcategory) => (
            <li key={subcategory._id}>{subcategory.name}</li>
          ))}
        </div>
      ))}
    </section>
  );
};

// Categories.getInitialProps = async (ctx: NextContext) => {
//   console.log('poleciał get initial props');
//   const categories = await axios.get('http://localhost:3000/api/category').catch((err) => console.log(err));
//   if (!categories && ctx.res) ctx.res.statusCode = 404;
//   // return { categories };
//   console.log(categories);
//   return { categories };
// };

export default Categories;
