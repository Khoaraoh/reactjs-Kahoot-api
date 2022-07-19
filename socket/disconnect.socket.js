import gameManager from "../utils/classHelpers/GameManager.js";

const disconnectHandle = (io, socket) => {
    socket.on("disconnect", async () => {
        const id = socket.id;
        const room = socket?.player?.room ?? socket?.host?.room;
        const isHost = socket.host;

        console.log(isHost);
        if (room) {
            const game = gameManager.getGame(room);
            if (game) {
                // If user is host
                if (isHost) {
                    // gameManager.removeGame(game);

                    // io.to(room).emit("hostDisconnect");

                    // // Kick all client out of the room
                    // const clients = await io.in(room).fetchSockets();
                    // clients.forEach((client) => {
                    //   client.leave(room);

                    //   // Reset client socket
                    //   client.player = {};
                    // });
                    console.log(`Host of room ${room} has disconnected`);
                }
                // If user is normal player
                else {
                    // // Remove player from game

                    // game.removePlayer(id);
                    console.log(
                        `Player ${socket.player.name} has disconnected`
                    );

                    // // Notify host new player list

                    // const playersInRoom = game.getPlayersInGame();
                    // const host = socket?.player?.host;
                    // io.to(host).emit("receive__players", playersInRoom);
                }
            }
        }
        // If user is not player or host
        else {
            console.log(`user ${id} has disconnected`);
        }
    });
};

export default disconnectHandle;
