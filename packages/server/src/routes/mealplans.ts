import express, { Request, Response } from "express";
import { MealPlan } from "../models/MealPlan";
import MealPlans from "../services/MealPlanService";

const router = express.Router();

router.get("/", (_, res: Response) => {
  MealPlans.index()
    .then((list: MealPlan[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});


router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  MealPlans.get(id)
    .then((mealplan: MealPlan) => res.json(mealplan))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newMealPlan = req.body;

  MealPlans.create(newMealPlan)
    .then((created: MealPlan) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  MealPlans.update(id, updateData)
    .then((updated: MealPlan) => res.json(updated))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  MealPlans.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
