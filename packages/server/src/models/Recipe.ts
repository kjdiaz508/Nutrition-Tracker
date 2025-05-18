import mongoose, { Document } from "mongoose";

export interface Ingredient extends Document {
    name: string;
    unit: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Recipe extends Document {
    name: string;
    owner: mongoose.Types.ObjectId;
    public: boolean;
    href?: string; // get rid of this later
    ingredients: Ingredient[];
    steps: string[];
}