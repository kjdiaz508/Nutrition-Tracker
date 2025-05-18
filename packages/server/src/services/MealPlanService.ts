import mongoose, { Schema, model } from "mongoose";
import { Day, MealPlan } from "models/MealPlan";

const DaySchema = new Schema<Day>(
  {
    weekday: { type: String, required: true, trim: true },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { _id: false }
);

const MealPlanSchema = new Schema<MealPlan>(
  {
    name: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    public: { type: Boolean, required: true },
    days: { type: [DaySchema], default: [] },
  },
  {
    collection: "mealplans",
  }
);

const MealPlanModel = model<MealPlan>("MealPlan", MealPlanSchema);

function index(): Promise<MealPlan[]> {
  return MealPlanModel.find().populate("days.recipes");
}

function get(id: string): Promise<MealPlan> {
  return MealPlanModel.findById(id)
    .populate("days.recipes")
    .then((mp) => {
      if (!mp) throw `${id} not found`;
      return mp;
    });
}

function create(json: MealPlan): Promise<MealPlan> {
  const newMP = new MealPlanModel(json);
  return newMP.save();
}

function update(id: string, json: MealPlan): Promise<MealPlan> {
  return MealPlanModel.findByIdAndUpdate(id, json, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      return updated;
    }
  );
}

function remove(id: string): Promise<void> {
  return MealPlanModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
