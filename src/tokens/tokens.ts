import { createHash, randomUUID } from "crypto";


let tokens: string[] = [];

export const getTokenEntry = (token: string) => {
    return tokens.includes(token);
}

/**
 * Build a token for a client.
 * @returns token
 */
export const createToken = () => {
    const hash = createHash("sha256");
    let token = hash.update(randomUUID()).digest("base64");
    tokens.push(token);
    return token;
}

export const removeToken = (token: string) => {
   tokens = tokens.filter(x => x !== token);
}
