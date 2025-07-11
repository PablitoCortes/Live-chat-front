import mongoose from "mongoose";
import { Conversation } from "./Conversation";
import { Message } from "./Message";

export interface User {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  email: string;
  password: string;
  name: string;
  username?: string;
  creationDate?: Date;
  conversations?: Conversation[];
  messages?: Message[];
  contacts?: Partial<User>[];
}
