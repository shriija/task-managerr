import registerConnectionHandlers from './handlers/connectionHandler.js';
import registerCardHandlers from './handlers/cardHandler.js';
import registerListHandlers from './handlers/listHandler.js';
import registerBoardHandlers from './handlers/boardHandler.js';

export default function boardSocket(io) {
  io.on("connection", (socket) => {
    socket.joinedBoards = new Set();

    registerConnectionHandlers(socket, io);
    registerCardHandlers(socket);
    registerListHandlers(socket);
    registerBoardHandlers(socket);
  });
}