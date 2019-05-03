import * as React from 'react';
import axios from 'axios';
import { NextFunctionComponent } from 'next';
import Link from 'next/link';
import Router from 'next/router';

import { Input, Button } from '../../../components';
import { INewCategory } from '../../../types/Category';

const CreateCategory: NextFunctionComponent = () => {
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [subcategories, updateSubcategories] = React.useState<string[]>(['']);

  const addSubcategory = (): void => updateSubcategories([...subcategories, '']);
  const removeSubcategory = (removeIndex: number): void =>
    updateSubcategories(subcategories.filter((_, index) => index !== removeIndex));
  const updateSubcategory = (updatedValue: string, updateIndex: number): void =>
    updateSubcategories(
      subcategories.map((currentValue, index) => (index === updateIndex ? updatedValue : currentValue))
    );

  return (
    <section>
      <Link href="/category">
        <a>Go back </a>
      </Link>
      <h1>Add new</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newCategory: INewCategory = { name: categoryName, subcategories };
          axios.post('/api/category', newCategory).then(() => {
            Router.push('/categories');
          });
          // error handling on ui will not be added now
        }}
      >
        <Input
          label="Category name"
          fieldName="categoryName"
          onChange={setCategoryName}
          value={categoryName}
          required
        />
        <h2>Subcategories</h2>
        {(!!subcategories.length &&
          subcategories.map((subcategoryName, index) => (
            <div key={index}>
              <Input
                label={`subcategory ${index}`}
                fieldName={`subcategory-${index}`}
                value={subcategoryName}
                onChange={(value) => updateSubcategory(value, index)}
                required
              />
              <Button onChange={() => removeSubcategory(index)} label="Remove subcategory" />
            </div>
          ))) || <p>subcategories cannot be empty</p>}
        <Button onChange={addSubcategory} label="Add subcategory" />
        <Button type="submit" label="submit" />
      </form>
    </section>
  );
};

export default CreateCategory;
