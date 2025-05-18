import { User } from "models/User";
import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema<User>({
    firstName: { type: String, required: true, trim: true},
    lastName: { type: String, required: true, trim: true},
    email: { type: String, required: true, trim: true},
    currentMealPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
    mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }]
}, { collection: "users" });

const UserModel = model<User>("User", UserSchema);

function index(): Promise<User[]> {
    return UserModel.find();
}

function get(_id: string): Promise<User | null> {
    return UserModel.findById(_id).exec().catch((err) => {
        throw new Error(`${_id} Not Found`);
    });
}

export default { index, get };