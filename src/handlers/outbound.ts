import { Socket } from "socket.io";
import { ChatEvent } from "../messages/event";
import { Greeting, BaseMessage } from "../messages/message";

export function greetUser(socket: Socket) {
    let message: Greeting = {
        sender: "Server",
        message: "Hi!",
        id: socket.id
    }
    sendMessage(socket, ChatEvent.greeting, message);
}

export function sendMessage(socket: Socket, event: ChatEvent, message: BaseMessage) {
    socket.emit(event.toString(), message);
}

/**
 * Send to everyone in the room except the original sender.
 * @param socket the Socket used
 * @param event defines the event ('typing', 'chat message, etc)
 * @param message the message to send
 */
export function broadcastToOthers(socket: Socket, event: ChatEvent, message: BaseMessage) {
    socket.broadcast.emit(event.toString(), message);
}

