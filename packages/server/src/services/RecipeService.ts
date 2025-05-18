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

function get(id: string): Promise<Recipe> {
  return RecipeModel.findById(id).then((recipe) => {
    if (!recipe) throw `${id} not found`;
    return recipe;
  });
}

function create(json: Recipe): Promise<Recipe> {
  const newRecipe = new RecipeModel(json);
  return newRecipe.save();
}

function update(id: string, json: Recipe): Promise<Recipe> {
  return RecipeModel.findByIdAndUpdate(id, json, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}

function remove(id: string): Promise<void> {
  return RecipeModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };

