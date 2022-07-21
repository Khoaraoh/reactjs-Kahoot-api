import gameManager from "../utils/classHelpers/GameManager.js";

const playerHandle = (io, socket) => {
  console.log('socket join id', socket.id)
    const joinRoom = async (payload) => {
        const room = payload.room;

        const game = gameManager.getGame(room);
        if (game) {
            const player = {
                id: socket.id,
                room,
                name: payload.name,
                score: 0,
            };
            game.addPlayerToGame(player);

            socket.join(room);

            // Save player data into socket to handle disconnect
            socket.player = { ...player, host: game.getHost() };

            // Send res if player join success or not
            io.to(socket.id).emit("joinRoomRes", {
                result: true,
                msg: "Joined successfully",
                player,
            });

            sendAllPlayersInfoInRoom(room);
        } else {
            io.to(socket.id).emit("joinRoomRes", {
                result: false,
                msg: "Joined failed",
            });
        }
    };

    const sendAllPlayersInfoInRoom = (room) => {
        const game = gameManager.getGame(room);
        if (game) {
            const playersInRoom = game.getAllPlayersInGame();
            io.to(game.host).emit("receive__players", playersInRoom);
        }
    };

    const answer = (params) => {
      const {playerId, questionId, answerContent, index} = params;
        const game = gameManager.getGameWithPlayer(playerId);
        if (game) {
            const newList = game.updatePlayerAnswer(
                playerId,
                questionId,
                answerContent,
                index
            );

            const playerInfo = game.getPlayer(playerId);
            io.to(game.host).emit("playerAnswerRes", newList);
            io.to(socket.id).emit("updatePlayerInfo", playerInfo);

            console.log("Players in room: ", game.getAllPlayersInGame().length);
            console.log("Player answer: ", newList.playerAnswers.length);

            if (
                game.getAllPlayersInGame().length ===
                newList.playerAnswers.length
            ) {
                console.log("All player answered the question");
                io.to(game.room).emit("questionTimeOut");
            }
        }else{
          console.log('loi roi')
        }
    };

    const playerDisconnect = () => {
        const game = gameManager.getGameWithPlayer(socket.id);
        if (game) {
            game.removePlayer(socket.id);
            sendAllPlayersInfoInRoom(game.room);
        }
    };

    socket.on("joinRoom", joinRoom); //done
    socket.on("playerAnswer", answer); //done
    socket.on("disconnect", playerDisconnect);
};

export default playerHandle;
