// src/server.ts
import * as express from 'express';
import { ChatEvent } from './constants';
import { ChatMessage } from './types';
import { Server } from 'socket.io';

var cors = require('cors');

export class ChatServer {
  // ChatServer class properties
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private io: any;
  private port: number;

  constructor() {
    this._app = express();
    this.port = parseInt(process.env.PORT) || ChatServer.PORT;
    this._app.options('*', cors());
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = new Server();
  }

  /*createServer({}, this._app)(cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  })*/

  private listen(): void {
    // server listening on our defined port
    this.io.listen(this.port);
    console.log('Server listening on port %d.', this.port);

    //socket events
    this.io.on(ChatEvent.CONNECT, (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });
      socket.on(ChatEvent.DISCONNECT, () => {
        console.log('Client disconnected');
      });
    });
  }
}
