import mongoose, { Schema } from "mongoose";

export interface Credential {
    username: string;
    hashedPassword: string;
    userId: mongoose.Types.ObjectId;
}

