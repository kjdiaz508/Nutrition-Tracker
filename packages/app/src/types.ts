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

export interface MealPlanPreview {
  _id: string;
  name: string;
}

export interface RecipePreview {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  currentMealPlan?: MealPlan;
  mealPlans: MealPlanPreview[];
  recipes: RecipePreview[];
}
