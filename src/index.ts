import 'dotenv/config'
import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const io = new Server(server);


instrument(io, {
    auth: false
});

const TOKEN = process.env.TOKEN;

io.use((socket, next) => {
    if (socket.handshake.auth.token === TOKEN) {
        console.info("Valid token");
        next();
    } else {
        const error = new Error("Invalid token");
        next(error);
    }
})

import { User } from './users/user';
import { isValid } from './messages/validator';
import { ChatMessage, Greeting, UserStatusMessage, UserStatus, BaseMessage, TypingMessage } from './messages/message';
import { ChatEvent } from './messages/event';
import { greetUser, broadcastToOthers, sendMessage } from './handlers/outbound';

const port = 8080;

let users: User[] = [];


/**
 * Send to everyone in the room. Could be expanded to specific chatrooms later.
 * @param event defines the event used (e.g. 'user list')
 * @param message the message to use
 */
function broadcastToEveryone(event: ChatEvent, message: BaseMessage) {
    io.emit(event.toString(), message);
}

io.on(ChatEvent.connection.toString(), (socket) => {
    console.log('a user connected');
    greetUser(socket);
    socket.on(ChatEvent.disconnection.toString(), () => {
        let oldUser = users.filter(x => x.id === socket.id);
        users = users.filter(x => x.id !== socket.id);
        let message: UserStatusMessage = {
            users: users,
            sender: oldUser[0].name,
            status: UserStatus.disconnecting
        };
        broadcastToEveryone(ChatEvent.chatMessage, message);
    });

    socket.on(ChatEvent.chatMessage.toString(), (msg: ChatMessage) => {
        if (isValid(msg)) {
            // no need to send this back to ourselves
            broadcastToOthers(socket, ChatEvent.chatMessage, msg);
        } else {
            // let the user know they're being very naughty
            let warning: ChatMessage = {
                sender: "Server",
                message: `Tut tut, ${msg.sender}`
            }
            sendMessage(socket, ChatEvent.chatMessage, warning);
        }
    });

    socket.on(ChatEvent.typing.toString(), (msg: BaseMessage) => {
        let isTypingMessage: TypingMessage = {
            id: socket.id,
            sender: msg.sender
        }
        // send to everyone but the original sender
        broadcastToOthers(socket, ChatEvent.typing, isTypingMessage);
    });

    socket.on(ChatEvent.newUser.toString(), (msg: BaseMessage) => {
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
        broadcastToEveryone(ChatEvent.userList, message);
    });
});



server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
