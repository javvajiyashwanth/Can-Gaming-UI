// Socket IO
import { Server } from 'socket.io';

// Utils
import { generateRoomId } from '../../../utils/Global';

export const createRoom = async () => {
    let roomId = generateRoomId();
    while (rooms.has(roomId)) roomId = generateRoomId();
    rooms.set(roomId, {
        players: [],
        board: Array(9).fill(null),
    });
    return roomId;
};

export const addPlayerToRoom = (roomId, player) => {
    const room = rooms.get(roomId);
    room.players.push({
        ...player,
        value: "",
    });
};

const rooms = new Map();

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        io.on("connection", socket => {
            socket.on("New Game", ({ name, email }) => {
                createRoom().then(roomId => {
                    addPlayerToRoom(roomId, {
                        socketId: socket.id,
                        name,
                        email,
                    });
                    socket.join(roomId);
                    io.to(roomId).emit("Waiting", { roomId });
                });
            });
            socket.on("Join Room", ({ name, email, roomId }) => {
                if (rooms.has(roomId)) {
                    const room = rooms.get(roomId);
                    if (room.players.length === 1) {
                        if (room.players[0].email === email) {
                            socket.emit("Alert", {
                                severity: "warning",
                                message: `You are already in the room id ${roomId}`,
                            });
                        } else {
                            addPlayerToRoom(roomId, {
                                socketId: socket.id,
                                name,
                                email,
                            });
                            socket.join(roomId);
                            const { socketId: playerOneSocket, ...playerOne } = room.players[0];
                            const { socketId: playerTwoSocket, ...playerTwo } = room.players[1];
                            socket.emit("Join Successful", { otherPlayer: playerOne });
                            io.to(playerOneSocket).emit("Other Player Joined", { otherPlayer: playerTwo });
                        }
                    } else {
                        socket.emit("Alert", {
                            severity: "warning",
                            message: `Room ID ${roomId} is full`,
                        });
                    }
                } else {
                    socket.emit("Alert", {
                        severity: "error",
                        message: `Room ID ${roomId} doesn't exist`,
                    });
                }
            });
            socket.on("Set Turn", ({ player, opponent, roomId }) => {
                const room = rooms.get(roomId);
                room.players[0].value = player;
                room.players[1].value = opponent;
                const { socketId: playerOneSocket, ...playerOne } = room.players[0];
                const { socketId: playerTwoSocket, ...playerTwo } = room.players[1];
                io.to(playerOneSocket).emit("Set Players", { players: [playerOne, playerTwo] });
                io.to(playerTwoSocket).emit("Set Players", { players: [playerTwo, playerOne] });
            });
            socket.on("Move", ({ index, placeValue, roomId }) => {
                const board = rooms.get(roomId).board;
                board[index] = placeValue;
                io.to(roomId).emit("Update Game State", {
                    board,
                    turn: placeValue === "X" ? "O" : "X",
                });
            });
            socket.on("Send Play Again Request", ({ email, roomId }) => {
                const room = rooms.get(roomId);
                const playerIndex = room.players[0].email === email ? 0 : 1;
                const otherPlayerIndex = room.players[0].email === email ? 1 : 0;
                io.to(room.players[playerIndex].socketId).emit("Play Again Request Sent");
                io.to(room.players[otherPlayerIndex].socketId).emit("Play Again Request Received");
            });
            socket.on("Accept Play Again Request", ({ roomId }) => {
                const room = rooms.get(roomId);
                room.board = Array(9).fill(null);
                room.players[0].value = "";
                room.players[1].value = "";
                const { socketId: playerOneSocket, ...playerOne } = room.players[0];
                const { socketId: playerTwoSocket, ...playerTwo } = room.players[1];
                io.to(playerOneSocket).emit("Play Again", { players: [playerOne, playerTwo], isCreator: true });
                io.to(playerTwoSocket).emit("Play Again", { players: [playerTwo, playerOne], isCreator: false });
            });
            socket.on('disconnecting', () => {
                // @ts-ignore
                const currentRooms = [...socket.rooms];
                if (currentRooms.length === 2) {
                    const roomId = currentRooms[1];
                    const currentRoom = rooms.get(roomId);
                    switch (currentRoom.players.length) {
                        case 1:
                            rooms.delete(roomId);
                            break;
                        case 2:
                            const player = currentRoom.players.filter((player) => player.socketId === socket.id)[0];
                            currentRoom.players = currentRoom.players.filter((player) => player.socketId !== socket.id);
                            io.to(roomId).emit("Alert", {
                                severity: "info",
                                message: `${player.name} got disconnected. You are the host now!`,
                            });
                            io.to(roomId).emit("Waiting", { roomId });
                    }
                }
            });
        });
        res.socket.server.io = io;
    }
    res.end();
}

export const config = {
    api: {
        bodyParser: false,
    },
}

export default ioHandler;