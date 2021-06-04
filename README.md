# LiveChat

A simple chat web application using Typescript, NodeJS, Express and Socket.io.

## Installation Instruction for Backend-Development

### YARN

Make sure you have a current 1.x YARN version installed.
If not then run

```zsh
npm install --global yarn
```

### Install Dependencies for Backend

The backend uses **Typescript**, **NodeJS**, **Express** and **Socket.io**
Run

```zsh
yarn add typescript express @types/express socket.io @types/socket.io
```

Typescript compilation takes place in background via the npm package `ts-node-dev`.

Run

```zsh
yarn add ts-node-dev --dev
```

to install it for use during development.

All preparations for the backend development are now finished.

## Backend Development

* Add scripts to `package.json` for use in _development_ and _production_.

```code

// package.json
{
   ...
   "scripts": { 
      "dev": "ts-node-dev --respawn --transpile ./src/server.ts",
      "prod": "tsc && node ./dist/server.js"
   },
   ...
}
```

* Configure Typescript Compiler Options in `tsconfig.json`

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": false,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "*": [
        "node_modules/",
        "src/types/*"
      ]
    }
  },
  "include": [
    "src/**/*"
  ]
}
```

* Implement the Server

```typescript
// src/server.ts
import { ChatServer } from './ChatServer';
let app = new ChatServer().app;
export { app };
```

* Datastructure Definitions `types.ts` and `constants.ts``

```typescript
// src/constants.ts
export enum ChatEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message'
}
```

```typescript
// src/types.ts
export interface ChatMessage { 
   author: string;
   message: string;
}
```

* ChatServer Implementation

```typescript
// src/server.ts

// ChatServer class properties
public static readonly PORT: number = 8080;
private _app: express.Application;
private server: Server;
private io: SocketIO.Server;
private port: string | number;

constructor () {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  
private initSocket (): void {
   this.io = socketIo(this.server);
}

private listen (): void {
   // server listening on our defined port
   this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
   });
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

get app (): express.Application {
   return this._app;
}
let app = new ChatServer().app; // calling the getter method here
export { app };
```
