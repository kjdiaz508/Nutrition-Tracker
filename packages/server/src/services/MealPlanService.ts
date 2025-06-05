import mongoose, { Schema, model, HydratedDocument } from "mongoose";
import { Day, MealPlan } from "models";

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
      type: String,
      required: true,
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
  return MealPlanModel
    .find()
    .populate("days.recipes")
    .then((mps) => {
      console.log(mps);
      return mps;
    });
}

function get(id: string): Promise<HydratedDocument<MealPlan>> {
  return MealPlanModel.findById(id)
    .populate("days.recipes")
    .then((mp) => {
      if (!mp) throw `${id} not found`;
      return mp;
    });
}

function create(json: MealPlan): Promise<HydratedDocument<MealPlan>> {
  const newMP = new MealPlanModel(json);
  return newMP.save();
}

async function update(id: string, json: MealPlan, username: string): Promise<HydratedDocument<MealPlan>> {
  const plan = await MealPlanModel.findById(id);
  if (!plan) throw `${id} not found`;
  if (plan.owner !== username) throw `Unauthorized`;

  return MealPlanModel.findByIdAndUpdate(id, json, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}

async function remove(id: string, username: string): Promise<void> {
  const plan = await MealPlanModel.findById(id);
  if (!plan) throw `${id} not found`;
  if (plan.owner !== username) throw `Unauthorized`;

  await MealPlanModel.findByIdAndDelete(id);
}

function getPublic(): Promise<MealPlan[]> {
  return MealPlanModel.find({ public: true }).populate("days.recipes");
}

function getByUsername(username: string): Promise<MealPlan[]> {
  return MealPlanModel.find()
    .populate("days.recipes")
    .then((plans) => plans.filter((p) => p.owner === username));
}

function getAccessibleByUsername(username: string): Promise<HydratedDocument<MealPlan>[]> {
  return MealPlanModel.find()
    .populate("days.recipes")
    .then((plans) =>
      plans.filter(
        (p) => p.public || p.owner === username
      )
    );
}

function getIfAuthorized(id: string, username: string): Promise<HydratedDocument<MealPlan>> {
  return MealPlanModel.findById(id)
    .populate("days.recipes")
    .then((plan) => {
      if (!plan) throw `${id} not found`;
      if (!plan.public && plan.owner !== username)
        throw `Unauthorized access to ${id}`;
      return plan;
    });
}

export default {
  index, get, create, update, remove,
  getPublic,
  getByUsername,
  getAccessibleByUsername,
  getIfAuthorized
};

