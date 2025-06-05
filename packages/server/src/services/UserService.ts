import { MealPlan, User } from "models";
import mongoose, { HydratedDocument, model, Schema } from "mongoose";

const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    currentMealPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
    mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { collection: "users" }
);

const UserModel = model<User>("User", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find()
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan");
}

function get(id: string): Promise<HydratedDocument<User>> {
  return UserModel.findById(id)
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan")
    .then((user) => {
      console.log(user);
      if (!user) throw `${id} not found`;
      return user;
    });
}

function appendMealPlan(
  username: string,
  planId: string | mongoose.Types.ObjectId
): Promise<HydratedDocument<User>> {
  return UserModel.findOneAndUpdate(
    { username },
    { $addToSet: { mealPlans: planId } }, // ensures no duplicates
    { new: true }
  ).then((plan) => {
    if (!plan) throw `${plan} not added`;
    return plan;
  });
}

function getByUsername(username: string): Promise<HydratedDocument<User>> {
  return UserModel.findOne({ username })
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan")
    .populate({
      path: "currentMealPlan",
      populate: {
        path: "days.recipes",
        model: "Recipe", // only necessary if not inferred
      },
    })

    .then((user) => {
      console.log(user);
      if (!user) throw `${username} not found`;
      return user;
    });
}

function create(json: User): Promise<HydratedDocument<User>> {
  const newUser = new UserModel(json);
  return newUser.save();
}

function update(username: string, json: User): Promise<User> {
  return UserModel.findOneAndUpdate({ username }, json, { new: true })
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan")
    .populate({
      path: "currentMealPlan",
      populate: {
        path: "days.recipes",
        model: "Recipe", // only necessary if not inferred
      },
    })

    .then((updated) => {
      console.log(updated);
      if (!updated) throw `${username} not updated`;
      return updated;
    });
}

function remove(id: string): Promise<void> {
  return UserModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default {
  index,
  get,
  getByUsername,
  create,
  update,
  remove,
  appendMealPlan,
};
