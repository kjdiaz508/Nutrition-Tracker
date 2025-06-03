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
var recipes_exports = {};
__export(recipes_exports, {
  default: () => recipes_default
});
module.exports = __toCommonJS(recipes_exports);
var import_express = __toESM(require("express"));
var import_auth = require("./auth");
var import_RecipeService = __toESM(require("../services/RecipeService"));
const router = import_express.default.Router();
router.get("/public", (_, res) => {
  import_RecipeService.default.getPublic().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/private", import_auth.authenticateUser, (req, res) => {
  const username = req.user?.username;
  import_RecipeService.default.getByUsername(username).then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/", import_auth.authenticateUser, (req, res) => {
  const username = req.user?.username;
  import_RecipeService.default.getAccessibleByUsername(username).then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", import_auth.authenticateUser, (req, res) => {
  const { id } = req.params;
  const username = req.user?.username;
  import_RecipeService.default.getIfAuthorized(id, username).then((recipe) => res.json(recipe)).catch((err) => res.status(403).send(err));
});
router.post("/", import_auth.authenticateUser, (req, res) => {
  const newRecipe = req.body;
  newRecipe.owner = req.user?.username;
  import_RecipeService.default.create(newRecipe).then((created) => res.status(201).json(created)).catch((err) => res.status(500).send(err));
});
router.put("/:id", import_auth.authenticateUser, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const username = req.user?.username;
  import_RecipeService.default.update(id, updateData, username).then((updated) => res.json(updated)).catch((err) => res.status(404).send(err));
});
router.delete("/:id", import_auth.authenticateUser, (req, res) => {
  const { id } = req.params;
  const username = req.user?.username;
  import_RecipeService.default.remove(id, username).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var recipes_default = router;
