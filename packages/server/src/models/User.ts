import mongoose, { Document } from "mongoose";

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    currentMealPlan?: mongoose.Types.ObjectId;
    mealPlans: mongoose.Types.ObjectId[];
    recipes: mongoose.Types.ObjectId[];
}