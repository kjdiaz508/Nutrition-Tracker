import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/CredentialService";
import Users from "../services/UserService";

const router = express.Router();
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(
  username: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    // Step 1: Create User document
    Users.create({
      username,
      firstName: "New",
      lastName: "User",
      mealPlans: [],
      recipes: [],
    })
      // Step 2: Create Credential linked to that user
      .then((newUser) =>
        credentials
          .create(newUser.username, password, newUser._id.toString())
          .then((creds) =>
            // Step 3: Generate token including userId
            generateAccessToken(creds.username).then(
              (token) => res.status(201).send({ token, userId: newUser._id })
            )
          )
      )
      .catch((err: any) => res.status(409).send({ error: err.message }));
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((creds) =>
        generateAccessToken(creds.username).then((token) =>
          res.status(200).send({ token, userId: creds.userId })
        )
      )
      .catch(() => res.status(401).send("Unauthorized"));
  }
});


export function authenticateUser(
  req: Request & { user?: any},
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded){
        req.user = decoded;
        next();
      } 
      else res.status(403).end();
    });
  }
}

export default router;
