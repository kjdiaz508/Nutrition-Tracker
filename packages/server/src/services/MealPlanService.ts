import mongoose, { Schema, model } from "mongoose";
import { Day, MealPlan } from "models/MealPlan";

const DaySchema = new Schema<Day>({
  weekday: { type: String, required: true, trim: true },
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
}, { _id: false });

const MealPlanSchema = new Schema<MealPlan>({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  public: { type: Boolean, required: true },
  days: { type: [DaySchema], default: [] },
}, {
  collection: "mealplans"
});

const MealPlanModel = model<MealPlan>("MealPlan", MealPlanSchema);

function index(): Promise<MealPlan[]> {
  return MealPlanModel.find();
}

function get(_id: string): Promise<MealPlan | null> {
  return MealPlanModel.findById(_id).exec().catch((err) => {
    throw new Error(`${_id} Not Found`);
  });
}

export default { index, get };