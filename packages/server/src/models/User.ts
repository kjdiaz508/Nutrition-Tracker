import mongoose, { Document } from "mongoose";

export interface User {
    firstName: string;
    lastName: string;
    username: string;
    currentMealPlan?: mongoose.Types.ObjectId;
    mealPlans: mongoose.Types.ObjectId[];
    recipes: mongoose.Types.ObjectId[];
}