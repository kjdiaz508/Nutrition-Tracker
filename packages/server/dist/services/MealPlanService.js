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
var MealPlanService_exports = {};
__export(MealPlanService_exports, {
  default: () => MealPlanService_default
});
module.exports = __toCommonJS(MealPlanService_exports);
var import_mongoose = __toESM(require("mongoose"));
const DaySchema = new import_mongoose.Schema(
  {
    weekday: { type: String, required: true, trim: true },
    recipes: [{ type: import_mongoose.default.Schema.Types.ObjectId, ref: "Recipe" }]
  },
  { _id: false }
);
const MealPlanSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    public: { type: Boolean, required: true },
    days: { type: [DaySchema], default: [] }
  },
  {
    collection: "mealplans"
  }
);
const MealPlanModel = (0, import_mongoose.model)("MealPlan", MealPlanSchema);
function index() {
  return MealPlanModel.find().populate("days.recipes");
}
function get(id) {
  return MealPlanModel.findById(id).populate("days.recipes").then((mp) => {
    if (!mp) throw `${id} not found`;
    return mp;
  });
}
function create(json) {
  const newMP = new MealPlanModel(json);
  return newMP.save();
}
function update(id, json) {
  return MealPlanModel.findByIdAndUpdate(id, json, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      return updated;
    }
  );
}
function remove(id) {
  return MealPlanModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var MealPlanService_default = { index, get, create, update, remove };
