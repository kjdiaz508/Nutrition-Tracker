import express, { Request, Response } from "express";
import { Recipe } from "../models/Recipe";
import Recipes from "../services/RecipeService";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Recipes.index()
    .then((list: Recipe[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Recipes.get(id)
    .then((recipe: Recipe) => res.json(recipe))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newRecipe = req.body;

  Recipes.create(newRecipe)
    .then((created: Recipe) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  Recipes.update(id, updateData)
    .then((updated: Recipe) => res.json(updated))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Recipes.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
