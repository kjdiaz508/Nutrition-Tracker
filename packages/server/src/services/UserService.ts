import { User } from "models/User";
import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    currentMealPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
    mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
  },
  { collection: "users" }
);

const UserModel = model<User>("User", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find()
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name");
}

function get(id: string): Promise<User> {
  return UserModel.findById(id)
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .then((user) => {
      if (!user) throw `${id} not found`;
      return user;
    });
}

function create(json: User): Promise<User> {
  const newUser = new UserModel(json);
  return newUser.save();
}

function update(id: string, json: User): Promise<User> {
  return UserModel.findByIdAndUpdate(id, json, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      return updated;
    }
  );
}

function remove(id: string): Promise<void> {
  return UserModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
