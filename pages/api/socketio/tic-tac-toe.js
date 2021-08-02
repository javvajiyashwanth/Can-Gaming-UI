// Socket IO
import { Server } from 'socket.io';

// Utils
import { generateRoomId } from '../../../utils/Global';

const rooms = new Map();

const createRoom = async () => {
    let roomId = generateRoomId();
    while (rooms.has(roomId)) {
        roomId = generateRoomId();
    }
    rooms.set(roomId, { players: [] });
    return roomId;
};

const addPlayerToRoom = (roomId, player) => rooms.get(roomId).players.push(player);

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
                        isHost: true,
                    });
                    socket.join(roomId);
                    socket.emit("Waiting", { roomId });
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
                                cause: "Join Room",
                            });
                        } else {
                            addPlayerToRoom(roomId, {
                                socketId: socket.id,
                                name,
                                email,
                                isHost: false,
                            });
                            socket.join(roomId);
                            const { socketId: playerOneSocket, ...playerOne } = room.players[0];
                            const { socketId: playerTwoSocket, ...playerTwo } = room.players[1];
                            socket.emit("Join Successful", { otherPlayer: playerOne });
                            io.to(playerOneSocket).emit("Join Successful", { otherPlayer: playerTwo });
                        }
                    } else {
                        socket.emit("Alert", {
                            severity: "warning",
                            message: `Room ID ${roomId} is full`,
                            cause: "Join Room",
                        });
                    }
                } else {
                    socket.emit("Alert", {
                        severity: "error",
                        message: `Room ID ${roomId} doesn't exist`,
                        cause: "Join Room",
                    });
                }
            });
            
            socket.on("Set Turn", ({ playerValue, opponentValue, roomId }) => {
                io.to(rooms.get(roomId).players[1].socketId).emit("Set Turn", {
                    playerValue: opponentValue,
                    opponentValue: playerValue,
                });
            });
            
            socket.on("Move", ({ index, value, roomId }) => {
                io.to(roomId).emit("Update Game State", {
                    index,
                    value,
                });
            });
            
            socket.on("Send Play Again Request", ({ email, roomId }) => {
                const room = rooms.get(roomId);
                const playerIndex = room.players[0].email === email ? 0 : 1;
                const otherPlayerIndex = room.players[0].email === email ? 1 : 0;
                io.to(room.players[playerIndex].socketId).emit("Play Again Request Sent");
                io.to(room.players[otherPlayerIndex].socketId).emit("Play Again Request Received");
            });

            socket.on("Accept Play Again Request", ({ roomId }) => io.to(roomId).emit("Play Again"));
            
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
                            if (player.isHost) {
                                currentRoom.players[0].isHost = true;
                                io.to(roomId).emit("Alert", {
                                    severity: "info",
                                    message: `${player.name} got disconnected. You are the host now!`,
                                    cause: "Host Left",
                                    payload: {
                                        roomId,
                                    },
                                });
                            } else {
                                io.to(roomId).emit("Alert", {
                                    severity: "info",
                                    message: `${player.name} got disconnected.`,
                                    cause: "Player Left",
                                });
                            }
                            break;
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