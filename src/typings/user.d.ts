import { Document } from "mongoose";
import { IScope } from "./scopes";
export interface IUser extends Document {
  email: string;
  password: string;
  scopes: IScope[];
}
