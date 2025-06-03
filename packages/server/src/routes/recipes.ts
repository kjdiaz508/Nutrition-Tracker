import express, { Request, Response } from "express";
import { authenticateUser } from "./auth";
import Recipes from "../services/RecipeService";

const router = express.Router();

// GET /api/recipes/public
router.get("/public", (_, res) => {
  Recipes.getPublic()
    .then((list) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET /api/recipes/private
router.get("/private", authenticateUser, (req: any, res) => {
  const username = req.user?.username;
  Recipes.getByUsername(username)
    .then((list) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET /api/recipes (all accessible recipes)
router.get("/", authenticateUser, (req: any, res) => {
  const username = req.user?.username;
  Recipes.getAccessibleByUsername(username)
    .then((list) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET /api/recipes/:id (only if user has permission)
router.get("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  const username = req.user?.username;
  Recipes.getIfAuthorized(id, username)
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(403).send(err));
});

// POST /api/recipes
router.post("/", authenticateUser, (req: any, res) => {
  const newRecipe = req.body;
  newRecipe.owner = req.user?.username;
  Recipes.create(newRecipe)
    .then((created) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT /api/recipes/:id
router.put("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const username = req.user?.username;
  Recipes.update(id, updateData, username)
    .then((updated) => res.json(updated))
    .catch((err) => res.status(404).send(err));
});

// DELETE /api/recipes/:id
router.delete("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  const username = req.user?.username;
  Recipes.remove(id, username)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
