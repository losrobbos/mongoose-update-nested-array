import mongoose from "mongoose"
const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("User", UserSchema)

