import { MealPlan, User } from "./types";

export interface Model {
  mealplan?: MealPlan;
  profile?: User;
}

export const init: Model = {}