import { User } from "../users/user";

export enum UserStatus {
    disconnecting = "disconnecting",
    joining = "joining"
}

export interface BaseMessage {
    sender: string;
}

export interface ChatMessage extends BaseMessage {
    message: string;
}

export interface Greeting extends ChatMessage {
    id: string;
}

export interface TypingMessage extends BaseMessage {
    id: string
}

export interface UserStatusMessage extends BaseMessage {
    users: User[];
    status: UserStatus;
}