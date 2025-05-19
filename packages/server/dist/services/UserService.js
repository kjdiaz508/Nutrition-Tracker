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
var UserService_exports = {};
__export(UserService_exports, {
  default: () => UserService_default
});
module.exports = __toCommonJS(UserService_exports);
var import_mongoose = __toESM(require("mongoose"));
const UserSchema = new import_mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    currentMealPlan: { type: import_mongoose.default.Schema.Types.ObjectId, ref: "MealPlan" },
    mealPlans: [{ type: import_mongoose.default.Schema.Types.ObjectId, ref: "MealPlan" }],
    recipes: [{ type: import_mongoose.default.Schema.Types.ObjectId, ref: "recipes" }]
  },
  { collection: "users" }
);
const UserModel = (0, import_mongoose.model)("User", UserSchema);
function index() {
  return UserModel.find().populate("mealPlans", "_id name").populate("recipes", "_id name");
}
function get(id) {
  return UserModel.findById(id).populate("mealPlans", "_id name").populate("recipes", "_id name").then((user) => {
    if (!user) throw `${id} not found`;
    return user;
  });
}
function create(json) {
  const newUser = new UserModel(json);
  return newUser.save();
}
function update(id, json) {
  return UserModel.findByIdAndUpdate(id, json, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      return updated;
    }
  );
}
function remove(id) {
  return UserModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var UserService_default = { index, get, create, update, remove };
