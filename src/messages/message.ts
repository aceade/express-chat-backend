import { User } from "../users/user";

export enum UserStatus {
    disconnecting,
    joining
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

export interface TypingMessage {
    sender: string;
}

export interface UserStatusMessage extends BaseMessage {
    users: User[];
    status: UserStatus;
}