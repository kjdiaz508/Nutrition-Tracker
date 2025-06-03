import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

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

app.use("/api/mealplans", authenticateUser, mealplans);
app.use("/api/recipes", authenticateUser, recipes);
app.use("/api/users", authenticateUser, users);

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
