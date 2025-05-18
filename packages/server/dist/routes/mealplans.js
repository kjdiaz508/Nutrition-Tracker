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
var mealplans_exports = {};
__export(mealplans_exports, {
  default: () => mealplans_default
});
module.exports = __toCommonJS(mealplans_exports);
var import_express = __toESM(require("express"));
var import_MealPlanService = __toESM(require("../services/MealPlanService"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_MealPlanService.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  import_MealPlanService.default.get(id).then((mealplan) => res.json(mealplan)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newMealPlan = req.body;
  import_MealPlanService.default.create(newMealPlan).then((created) => res.status(201).json(created)).catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  import_MealPlanService.default.update(id, updateData).then((updated) => res.json(updated)).catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  import_MealPlanService.default.remove(id).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var mealplans_default = router;
