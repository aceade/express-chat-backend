import { io } from "socket.io-client";

let socket = undefined;

/**
 * Start the chat
 * @param {object} notificationMethods 
 */
export const startChat = (notificationMethods) => {
    const newChatMessageListener = notificationMethods.newChatMessageListener;
    const typingListener = notificationMethods.typingListener;
    const usersListener = notificationMethods.usersListener;
    const newChatListener = notificationMethods.newChatListener;
    socket = io();
    socket.on("chatMessage", newChatMessageListener);
    socket.on("typing", typingListener);
    socket.on("userList", usersListener);
    socket.on("greeting", newChatListener);
}

export const closeChat = () => {
    io.close();
}

/**
 * Send a chat message. Empty messages will be ignored, as they are useless.
 * Will return the message so it can be displayed.
 * @param {string} text
 * @param {string} name
 * @returns
 */
export const sendChatMessage = (text, name) => {
    if (text.trim().length > 0) {
        let msg = {
            sender: name,
            message: text
        };
        socket.emit('chat message', msg);
        return msg;
    }
}

/**
 * Let the server know that the user is joining. It will update the users and send them out to everyone.
 * @param {string} name
 */
export const sendNewUser = (name) => {
    let msg = {
        sender: name
    }
    socket.emit('new user', msg);
}

/**
 * Let the server know that this user is typing. All other users will be notified.
 * @param {string} name
 */
export const sendIsTyping = (name) => {
    socket.emit("typing", {
        sender: name
    });
}

