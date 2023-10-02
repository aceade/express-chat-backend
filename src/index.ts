import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server, Socket } from "socket.io";
const io = new Server(server);

import { User } from './users/user';
import { isValid } from './messages/validator';
import { ChatMessage, Greeting, UserStatusMessage, UserStatus, BaseMessage } from './messages/message';

const port = 8080;

let users: User[] = [];

function greetUser(socket: Socket) {
    let message: Greeting = {
        sender: "Server",
        message: "Hi!",
        id: socket.id
    }
    socket.emit("greeting", message);
    sendMessage(socket, "greeting", message);
}

function sendMessage(socket: Socket, event: string, message: BaseMessage) {
    socket.emit(event, message);
}

/**
 * Send to everyone in the room except the original sender
 * @param socket the Socket used
 * @param event defines the event ('user list', 'greeting', etc)
 * @param message the message to send
 */
function broadcastToOthers(socket: Socket, event: string, message: BaseMessage) {
    socket.broadcast.emit(event, message);
}

/**
 * Send to everyone in the room. Could be expanded to specific chatrooms later.
 * @param event defines the event used (e.g. 'user list')
 * @param message the message to use
 */
function broadcastToEveryone(event: string, message: BaseMessage) {
    io.emit(event, message);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    greetUser(socket);
    socket.on('disconnect', () => {
        let oldUser = users.filter(x => x.id === socket.id);
        users = users.filter(x => x.id !== socket.id);
        let message: UserStatusMessage = {
            users: users,
            sender: oldUser[0].name,
            status: UserStatus.disconnecting
        };
        broadcastToEveryone("user list", message);
    });

    socket.on('chat message', (msg: ChatMessage) => {
        if (isValid(msg)) {
            // no need to send this back to ourselves
            broadcastToOthers(socket, "chat message", msg);
        } else {
            // let the user know they're being very naughty
            let warning: ChatMessage = {
                sender: "Server",
                message: `Tut tut, ${msg.sender}`
            }
            sendMessage(socket, "chat message", warning);
        }
    });

    socket.on("typing", (msg) => {
        // send to everyone but the original sender
        msg.id = socket.id;
        broadcastToOthers(socket, "typing", msg);
    });

    socket.on("new user", (msg) => {
        console.info("New user joined:", msg)
        users.push({
            name: msg.sender,
            id: socket.id,
            isTyping: false
        });

        let message: UserStatusMessage = {
            users: users,
            sender: msg.sender,
            status: UserStatus.joining
        };
        broadcastToEveryone("user list", message);
    });
});



server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
