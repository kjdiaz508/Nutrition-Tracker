"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var RecipeService_exports = {};
__export(RecipeService_exports, {
  default: () => RecipeService_default
});
module.exports = __toCommonJS(RecipeService_exports);
var import_mongoose = __toESM(require("mongoose"));
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
  owner: { type: import_mongoose.default.Schema.Types.ObjectId, required: true, ref: "User" },
  public: { type: Boolean, required: true },
  href: { type: String },
  ingredients: [IngredientSchema]
}, { collection: "recipes" });
const RecipeModel = (0, import_mongoose.model)("Recipe", RecipeSchema);
function index() {
  return RecipeModel.find();
}
function get(id) {
  return RecipeModel.findById(id).then((recipe) => {
    if (!recipe) throw `${id} not found`;
    return recipe;
  });
}
function create(json) {
  const newRecipe = new RecipeModel(json);
  return newRecipe.save();
}
function update(id, json) {
  return RecipeModel.findByIdAndUpdate(id, json, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}
function remove(id) {
  return RecipeModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var RecipeService_default = { index, get, create, update, remove };
