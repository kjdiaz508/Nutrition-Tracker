import mongoose, { Document } from "mongoose";

export interface Day extends Document {
  weekday: string;
  recipes: mongoose.Types.ObjectId[];
}

export interface MealPlan {
  name: string;
  owner: string;
  public: boolean;
  days: Day[];
}

export interface Credential {
    username: string;
    hashedPassword: string;
    userId: mongoose.Types.ObjectId;
}

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
    name: string;
    owner: string;
    public: boolean;
    ingredients: Ingredient[];
    steps: string[];
}

export interface User {
    firstName: string;
    lastName: string;
    username: string;
    currentMealPlan?: mongoose.Types.ObjectId;
    mealPlans: mongoose.Types.ObjectId[];
    recipes: mongoose.Types.ObjectId[];
}