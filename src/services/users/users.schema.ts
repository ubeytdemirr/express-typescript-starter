import bcrypt from "bcrypt";

import { model, Schema } from "mongoose";

import { IUser } from "../../typings/user";

const schema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

schema.pre<IUser>("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 8);

    next();
  } catch (e) {
    console.log(e);
  }
});

export default model<IUser>("Users", schema);
