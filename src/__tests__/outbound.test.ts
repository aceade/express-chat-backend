// adapted from https://socket.io/docs/v4/testing/

import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { broadcastToOthers, greetUser } from "../handlers/outbound";
import { ChatEvent } from "../messages/event";
import { ChatMessage } from "../messages/message";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Outbound handlers", () => {
  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, serverSocket: ServerSocket, clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket: ServerSocket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it("Sending greeting", () => {
    clientSocket.on(ChatEvent.greeting.toString(), (msg) => {
        expect(msg.sender).toBe("Server");
        expect(msg.message).toBe("Hi!");
    })
    greetUser(serverSocket);
    return waitFor(clientSocket, ChatEvent.greeting.toString());
  });

  xit("Sending ChatMessage to others - need to figure out the broadcast mocking", () => {
    const chatMessage: ChatMessage = {
        sender: "Me",
        message: "Testing"
    }
    broadcastToOthers(serverSocket, ChatEvent.chatMessage, chatMessage);
    expect(serverSocket.broadcast.emit).toHaveBeenCalled();
  });

});