import { createHash, randomUUID } from "crypto";

/**
 * Maximum is 1 hour.
 */
const MAX_TIME: number = 60 * 60 * 1000;

interface TokenMapping {
    token: string;
    socketId: string;
    created: number;
}

let tokens: TokenMapping[] = [];

export const getTokenEntry = (token: string) => {
    return tokens.find(x => x.token === token);
}

/**
 * Build a token for a client.
 * @returns token
 */
export const createToken = () => {
    const hash = createHash("sha256");
    let token = hash.update(randomUUID()).digest("base64");
    tokens.push({
        token: token,
        socketId: "",
        created: Date.now()
    });
    return token;
}

/**
 * Updating the socketID mapping
 * @param token the token that was previously generated
 * @param socketId the socket that is actually using it
 */
export const setSocket = (token: string, socketId: string) => {
    const entry = getTokenEntry(token);
    if (entry) {
        entry.socketId = socketId;
    }
}

export const removeToken = (token: string) => {
   tokens = tokens.filter(x => x.token !== token);
}

export const removeExpiredTokens = () => {
    let date = Date.now();
    tokens = tokens.filter(x => {
        (date - x.created) >= MAX_TIME
    });
    console.info(`There are now ${tokens.length} tokens`);
}
