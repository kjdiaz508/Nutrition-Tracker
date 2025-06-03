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
    owner: { type: String, required: true, ref: "User"},
    public: { type: Boolean, required: true},
    ingredients: [IngredientSchema]
}, { collection: "recipes" });

const RecipeModel = model<Recipe>("Recipe", RecipeSchema);

function getPublic(): Promise<Recipe[]> {
  return RecipeModel.find({ public: true });
}

function getByUsername(username: string): Promise<Recipe[]> {
  return RecipeModel.find({ owner: username });
}

function getAccessibleByUsername(username: string): Promise<Recipe[]> {
  return RecipeModel.find({ $or: [{ public: true }, { owner: username }] });
}

function getIfAuthorized(id: string, username: string): Promise<Recipe> {
  return RecipeModel.findById(id).then((recipe) => {
    if (!recipe) throw `${id} not found`;
    if (!recipe.public && recipe.owner !== username) throw `Unauthorized access to ${id}`;
    return recipe;
  });
}

function create(json: Recipe): Promise<Recipe> {
  const newRecipe = new RecipeModel(json);
  return newRecipe.save();
}

async function update(id: string, json: Recipe, username: string): Promise<Recipe> {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw `${id} not found`;
  if (recipe.owner !== username) throw `Unauthorized`;
  return RecipeModel.findByIdAndUpdate(id, json, { new: true }).then((r) => {
    if (!r) throw `${id} not updated`;
    return r;
  });
}

async function remove(id: string, username: string): Promise<void> {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw `${id} not found`;
  if (recipe.owner !== username) throw `Unauthorized`;
  await RecipeModel.findByIdAndDelete(id);
}

export default {
  getPublic,
  getByUsername,
  getAccessibleByUsername,
  getIfAuthorized,
  create,
  update,
  remove
};

