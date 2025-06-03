import express, { Request, Response } from "express";
import { authenticateUser } from "./auth";
import MealPlans from "../services/MealPlanService";

const router = express.Router();

// GET /api/mealplans/public
router.get("/public", (_, res) => {
  MealPlans.getPublic()
    .then((plans) => res.json(plans))
    .catch((err) => res.status(500).send(err));
});

// GET /api/mealplans/private
router.get("/private", authenticateUser, (req: any, res) => {
  const username = req.user?.username;
  MealPlans.getByUsername(username)
    .then((plans) => res.json(plans))
    .catch((err) => res.status(500).send(err));
});

// GET /api/mealplans (all plans accessible to the user)
router.get("/", authenticateUser, (req: any, res) => {
  const username = req.user?.username;
  MealPlans.getAccessibleByUsername(username)
    .then((plans) => res.json(plans))
    .catch((err) => res.status(500).send(err));
});

// GET /api/mealplans/:id (only if user has permission)
router.get("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  if (!req.user?.username) res.status(401).send("Unauthorized");
  const username = req.user.username;
  MealPlans.getIfAuthorized(id, username)
    .then((plan) => res.json(plan))
    .catch((err) => res.status(403).send(err));
});

// POST /api/mealplans
router.post("/", authenticateUser, (req: any, res) => {
  const newPlan = req.body;
  if (!req.user?.username) res.status(401).send("Unauthorized");
  newPlan.owner = req.user?.username;
  MealPlans.create(newPlan)
    .then((created) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT /api/mealplans/:id
router.put("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!req.user?.username) res.status(401).send("Unauthorized");
  const username = req.user?.username;
  MealPlans.update(id, updateData, username)
    .then((updated) => res.json(updated))
    .catch((err) => res.status(404).send(err));
});

// DELETE /api/mealplans/:id
router.delete("/:id", authenticateUser, (req: any, res) => {
  const { id } = req.params;
  if (!req.user?.username) res.status(401).send("Unauthorized");
  const username = req.user?.username;
  MealPlans.remove(id, username)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
