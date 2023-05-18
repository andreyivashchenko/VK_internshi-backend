import { Schema, model } from "mongoose";

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarImg: String,
    birthday: Date,
    city: String,
    university: String,
    roles: [{ type: String, ref: "Role" }],
  },
  {
    timestamps: true,
  }
);

export default model("User", User);
