import * as React from 'react';
import axios from 'axios';

import { Input, Button } from '../../../components';
import { NextFunctionComponent, NextContext } from 'next';
import Link from 'next/link';
import { ICreatedCategory } from '../../../types/Category';

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
      <Input label="Category name" fieldName="categoryName" onChange={setCategoryName} value={categoryName} />
      <h2>Subcategories</h2>
      {subcategories.map((subcategoryName, index) => (
        <div key={index}>
          <Input
            label={`subcategory ${index}`}
            fieldName={`subcategory-${index}`}
            value={subcategoryName}
            onChange={(value) => updateSubcategory(value, index)}
          />
          <Button onChange={() => removeSubcategory(index)} label="Remove subcategory" />
        </div>
      ))}
      <Button onChange={addSubcategory} label="Add subcategory" />
    </section>
  );
};

export default CreateCategory;
