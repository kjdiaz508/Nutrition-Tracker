import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";
import Users from "./UserService";

const credentialSchema = new Schema<Credential>(
  {
    username: { type: String, required: true, trim: true, unique: true },
    hashedPassword: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>("Credential", credentialSchema);

// Create new credential
function create(username: string, password: string, userId: string): Promise<Credential> {
  return credentialModel
    .find({ username })
    .then((found) => {
      if (found.length) throw new Error(`Username exists: ${username}`);
    })
    .then(() =>
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          const creds = new credentialModel({ username, hashedPassword, userId });
          return creds.save();
        })
    );
}


// Verify login credentials
function verify(username: string, password: string): Promise<Credential> {
  return credentialModel
    .find({ username })
    .then((found) => {
      if (!found || found.length !== 1) throw "Invalid username or password";
      return found[0];
    })
    .then((credsOnFile) =>
      bcrypt.compare(password, credsOnFile.hashedPassword).then((result) => {
        if (!result) throw "Invalid username or password";
        return credsOnFile;
      })
    );
}

export default { create, verify };
