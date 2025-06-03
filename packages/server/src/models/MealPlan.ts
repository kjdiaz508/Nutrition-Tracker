import mongoose, { Schema, Document, mongo, model } from "mongoose";

export interface Day extends Document {
  weekday: string;
  recipes: mongoose.Types.ObjectId[];
}

export interface MealPlan extends Document {
  name: string;
  owner: string;
  public: boolean;
  days: Day[];
}
