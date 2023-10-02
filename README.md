# express-chat-backend

A Socket.io/Express/TypeScript web chat backend. This is a test/practice service.

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