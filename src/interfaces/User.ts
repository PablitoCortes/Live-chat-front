import { Conversation } from './Conversation';
import { Message } from './Message';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?:string;
  creationDate?: string;
  conversations?: Conversation[];
  messages?: Message[];
  contacts?: Partial<User>[];
}

export interface RegisterData extends User {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
