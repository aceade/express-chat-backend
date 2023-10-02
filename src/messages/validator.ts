/**
 * A series of example validation methods.
 */

import { ChatMessage } from "./message";

const badWords = ["spam", "Turscar"];

const maxLength = 200;

const containsBadWords = (text: string) => {
    return badWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}

const isTooLong = (text: string) => {
    return text.length >= maxLength;
}

export const isValid = (msg: ChatMessage) => {
    return !containsBadWords(msg.message) &&
        !isTooLong(msg.message);
}
