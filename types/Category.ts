export interface INewCategory {
  name: string;
  subcategories: string[];
}
export interface ICreatedCategory {
  _id: any;
  id?: any;
  name: string;
  subcategories: ICreatedSubcategory[];
}

export interface INewSubcategory {
  name: string;
  userId: string;
}

export interface ICreatedSubcategory extends INewSubcategory {
  _id: any;
  id?: any;
}
