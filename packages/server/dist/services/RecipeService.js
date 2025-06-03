"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var RecipeService_exports = {};
__export(RecipeService_exports, {
  default: () => RecipeService_default
});
module.exports = __toCommonJS(RecipeService_exports);
var import_mongoose = require("mongoose");
const IngredientSchema = new import_mongoose.Schema({
  name: { type: String, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number }
}, { _id: false });
const RecipeSchema = new import_mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: String, required: true, ref: "User" },
  public: { type: Boolean, required: true },
  ingredients: [IngredientSchema]
}, { collection: "recipes" });
const RecipeModel = (0, import_mongoose.model)("Recipe", RecipeSchema);
function getPublic() {
  return RecipeModel.find({ public: true });
}
function getByUsername(username) {
  return RecipeModel.find({ owner: username });
}
function getAccessibleByUsername(username) {
  return RecipeModel.find({ $or: [{ public: true }, { owner: username }] });
}
function getIfAuthorized(id, username) {
  return RecipeModel.findById(id).then((recipe) => {
    if (!recipe) throw `${id} not found`;
    if (!recipe.public && recipe.owner !== username) throw `Unauthorized access to ${id}`;
    return recipe;
  });
}
function create(json) {
  const newRecipe = new RecipeModel(json);
  return newRecipe.save();
}
async function update(id, json, username) {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw `${id} not found`;
  if (recipe.owner !== username) throw `Unauthorized`;
  return RecipeModel.findByIdAndUpdate(id, json, { new: true }).then((r) => {
    if (!r) throw `${id} not updated`;
    return r;
  });
}
async function remove(id, username) {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw `${id} not found`;
  if (recipe.owner !== username) throw `Unauthorized`;
  await RecipeModel.findByIdAndDelete(id);
}
var RecipeService_default = {
  getPublic,
  getByUsername,
  getAccessibleByUsername,
  getIfAuthorized,
  create,
  update,
  remove
};
