import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";

import mealplans from "./routes/mealplans";
import recipes from "./routes/recipes";
import users from "./routes/users";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("Cluster0");

app.use(express.static(staticDir));
app.use(express.json());
app.use("/auth", auth);

app.use("/api/mealplans", mealplans);
app.use("/api/recipes", recipes);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
