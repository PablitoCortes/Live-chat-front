import { Conversation } from './Conversation';
import { Message } from './Message';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  username?: string;
  creationDate?: string; // Se puede manejar como string para compatibilidad con librerías de fechas
  conversations?: Conversation[];
  messages?: Message[];
  contacts?: Partial<User>[];
}

export interface RegisterData extends User {
  email: string;
  name: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
