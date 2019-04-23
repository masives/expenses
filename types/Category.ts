export interface ICategory {
  id?: any;
  name: string;
  subcategories: ISubcategory[];
}

export interface ISubcategory {
  id?: any;
  name: string;
  userId: string;
}
