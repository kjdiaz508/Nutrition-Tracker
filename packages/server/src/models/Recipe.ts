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
    owner: string;
    public: boolean;
    ingredients: Ingredient[];
    steps: string[];
}