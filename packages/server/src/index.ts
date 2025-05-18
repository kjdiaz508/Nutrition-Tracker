import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import MealPlanService from "./services/MealPlanService";
import RecipeService from "./services/RecipeService";
import UserService from "./services/UserService";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0");

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/mealplans", (req: Request, res: Response) => {
  MealPlanService.index().then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/mealplans/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  MealPlanService.get(id).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  })
})

app.get("/recipes", (req: Request, res: Response) => {
  RecipeService.index().then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/recipes/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  RecipeService.get(id).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  })
})

app.get("/users", (req: Request, res: Response) => {
  UserService.index().then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  UserService.get(id).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
