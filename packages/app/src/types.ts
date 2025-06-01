export interface Ingredient {
  name: string;
  unit: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  _id: string;
  name: string;
  href: string;
  ingredients: Ingredient[];
  steps: string[];
}

export interface MealDay {
  weekday: string;
  recipes: Recipe[];
}

export interface MealPlan {
  _id: string;
  name: string;
  owner: string;
  public: boolean;
  days: MealDay[];
}