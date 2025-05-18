import { Ingredient, Recipe } from "models/Recipe";
import mongoose, { Schema, model } from "mongoose";

const IngredientSchema = new Schema<Ingredient>({
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    amount: { type: Number, required: true},
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
}, { _id: false});

const RecipeSchema = new Schema<Recipe>({
    name: { type: String, required: true, trim: true},
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    public: { type: Boolean, required: true},
    href: { type: String },
    ingredients: [IngredientSchema]
}, { collection: "recipes" });

const RecipeModel = model<Recipe>("Recipe", RecipeSchema);

function index(): Promise<Recipe[]> {
    return RecipeModel.find();
}

function get(_id: string): Promise<Recipe | null> {
    return RecipeModel.findById(_id).exec().catch((err) => {
        throw new Error(`${_id} Not Found`);
    });
}

export default { index, get };

