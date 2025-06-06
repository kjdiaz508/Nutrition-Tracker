import express, { Request, Response } from "express";
import { User } from "../models";
import Users from "../services/UserService";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:username", (req: Request, res: Response) => {
  const { username } = req.params;

  Users.getByUsername(username)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});


router.post("/", (req: Request, res: Response) => {
  const newUser = req.body;

  Users.create(newUser)
    .then((created: User) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

router.put("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  const updateData = req.body;
  Users.update(username, updateData)
    .then((updated: User) => res.json(updated))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Users.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
