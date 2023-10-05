# express-chat-backend

A Socket.io/Express/TypeScript web chat backend. This is a test/practice service, with [the associated client](https://github.com/aceade/express-chat-client) available separately.

## Interface for the client

[The list of supported events](./src/messages/event.ts) combined with [the list of expected objects](./src/messages/message.ts) are summarised below.

| Event | Object |
|-------|--------|
| greeting | Greeting |
| chatMessage | ChatMessage |
| typing | TypingMessage |
| userList | UserStatusMessage |
| disconnection | UserStatusMessage |
| connection | - (no message) |
| newUser | BaseMessage |

## Running locally

Depending on your package manager:

### pnpm

- `echo "TOKEN=\"${token}\"" > .env `
- `pnpm install`
- `pnpm run dev`

### npm

- `echo "TOKEN=\"${token}\"" > .env `
- `npm install`
- `npm run dev`

## Authentication

The auth token is included in the environment variables **for testing only** and is shared across all clients. In practice, these should be unique to each client and stored elsewhere.