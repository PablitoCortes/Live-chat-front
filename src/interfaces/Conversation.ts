import { Message } from './Message';
import { User } from './User';

export interface Conversation {
  _id?: string;
  id?: string;
  participants: User[];
  messages?: string[];
  lastMessage?: Message;
  creationDate?: string;
  otherParticipant?: Partial<User>
}
