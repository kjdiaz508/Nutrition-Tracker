import { User } from "models/User";
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
    .populate("recipes", "_id name");
}

function get(id: string): Promise<HydratedDocument<User>> {
  return UserModel.findById(id)
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan")
    .then((user) => {
      if (!user) throw `${id} not found`;
      return user;
    });
}

function getByUsername(username: string): Promise<HydratedDocument<User>> {
  return UserModel.findOne({ username })
    .populate("mealPlans", "_id name")
    .populate("recipes", "_id name")
    .populate("currentMealPlan")
    .then((user) => {
      if (!user) throw `${username} not found`;
      return user;
    })
}

function create(json: User): Promise<HydratedDocument<User>> {
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

export default { index, get, getByUsername, create, update, remove };
