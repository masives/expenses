export interface INewCategory {
  name: string;
  subcategories: string[];
}

// category update
export interface ICreatedCategory {
  _id: any;
  id?: any;
  name: string;
  subcategories: ICreatedSubcategory[];
}

export interface ICategoryUpdate {
  _id?: any;
  id?: any;
  name?: string;
  subcategories?: string[];
}

export interface INewSubcategory {
  name: string;
  userId: string;
}

// subcategory update

export interface ICreatedSubcategory {
  name: string;
  userId: string;
  _id: any;
  id?: any;
}

export interface ISubcategoryUpdate {
  _id?: any;
  id?: any;
  name: string;
  userId?: string;
}
