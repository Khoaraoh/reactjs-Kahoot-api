import Game from "../utils/classHelpers/Game.js";
import gameManager from "../utils/classHelpers/GameManager.js";
import quizModel from "../models/index.model.js";

const hostHandle = (io, socket) => {
    const fetchUserQuizList = async (userId) => {
        if (socket.host) {
            gameManager.removeGame(socket.host.room);
        }

        const quizListResp = await quizModel.getUserQuiz(userId);
        const quizList = quizListResp.data;
        io.to(socket.id).emit("fetchQuizListRes", quizList);
    };

    const getQuiz = async (quizId) => {
        const quiz = await quizModel.getGame(quizId);

        if (quiz) {
            io.to(socket.id).emit("getQuizResult", {
                msg: "get quiz successfully",
                data: quiz,
            });
        } else {
            io.to(socket.id).emit("getQuizResult", {
                msg: "get quiz fail",
                data: null,
            });
        }
    };

    const updateQuiz = async (quizId, quizData) => {
        const result = quizModel.updateQuiz(quizId, quizData);
        if (result)
            io.to(socket.id).emit("updateQuizResult", {
                message: "update quiz success",
            });
        else {
            io.to(socket.id).emit("updateQuizResult", {
                message: "update quiz error",
            });
        }
    };

    const createGame = async (data) => {
        const index = data.questions.findIndex((item) => item.imgPath);

        data.imgPath =
            index !== -1
                ? data.questions[index].imgPath
                : `${process.env.BACKEND_URL}/images/noImage.jpg`;
        const result = await quizModel.addQuiz(data);

        if (result)
            io.to(socket.id).emit("createGameResult", { message: "success", result });
        else io.to(socket.id).emit("createGameResult", { message: "error" });
    };

    const deleteQuiz = async (quizId) => {
        const result = await quizModel.removeQuiz(quizId);

        if (result)
            io.to(socket.id).emit("deleteQuizResult", { message: "success" });
        else io.to(socket.id).emit("deleteQuizResult", { message: "error" });
    };

    const hostGame = async (id) => {
        // Load data from database
        const { data } = await quizModel.getGame(id);

        if (data) {
            const room = gameManager.getNextAvailableId();
            const newGame = new Game(room, socket.id, data);

            socket.join(room);
            socket.host = { id: socket.id, room };
            gameManager.addGame(newGame);

            io.to(socket.id).emit("hostGameRes", {
                result: true,
                msg: "Host successfully",
                game: newGame,
            });
        } else {
            io.to(socket.id).emit("hostGameRes", {
                result: false,
                msg: "Host failed",
            });
        }
    };

    const sendAllPlayersInfoInRoom = () => {
        const game = gameManager.getGameWithHost(socket.id);
        if (game) {
            const playersInRoom = game.getAllPlayersInGame();
            io.to(socket.id).emit("receive__players", playersInRoom);
        }
    };

    // Start game
    const startGame = () => {
        const game = gameManager.getGameWithHost(socket.id);
        if (game) {
            io.to(socket.host.room).emit("hostStartingGame");
            return;
        }
        io.to(socket.id).emit("startGameRes", { result: false });
    };

    // Get question
    const getQuestion = (startTime) => {
        const game = gameManager.getGameWithHost(socket.id);

        if (game) {
            const questionData = game.getQuestion();
            if (questionData) {
                io.to(socket.id).emit("getQuestionRes", {
                    questionData,
                    result: true,
                });

                setTimeout(() => {
                    io.to(socket.host.room).emit("hostGetQuestionRes", {
                        questionData,
                        result: true,
                    });
                }, startTime * 1000);
            } else {
                // Notify all player and the host if get question failed
                if (socket?.host?.room)
                    io.to(socket.host.room).emit("hostGetQuestionRes", {
                        result: false,
                    });
                io.to(socket.id).emit("getQuestionRes", { result: false });
            }
            return;
        }
        // Notify all player and the host if get question failed
        // io.to(room).emit("getQuestionRes", { result: false });
        io.to(socket.id).emit("getQuestionRes", { result: false });
        io.to(socket.host.room).emit("hostGetQuestionRes", {
            result: false,
        });
    };

    const stopQuestion = () => {
        const game = gameManager.getGameWithHost(socket.id);
        if (game) {
            io.to(socket.host.room).emit("questionTimeOut");
        }
    };

    const nextQuestion = () => {
        const game = gameManager.getGameWithHost(socket.id);

        if (game) {
            game.increaseQuestionIndex();

            if (game.currentQuestionIndex >= game.data.questions.length) {
                io.to(socket.host.room).emit("nextQuestionRes", {
                    result: false,
                });
                return;
            }
            io.to(socket.host.room).emit("nextQuestionRes", { result: true });
        }
    };

    const getRankList = () => {
        const game = gameManager.getGameWithHost(socket.id);

        if (game) {
            const rankList = game.getAllPlayersInGame().slice(0, 10);

            io.to(socket.host.room).emit("getRankListRes", {
                result: true,
                rankList,
            });
            return;
        }
        io.to(socket.host.room).emit("getRankListRes", { result: false });
        io.to(socket.id).emit("getRankListRes", { result: false });
    };

    const getSummaryRankList = (loadingTime) => {
      console.log('chay vo dc roi ne');
        const game = gameManager.getGameWithHost(socket.id);

        if (game) {
            const rankList = game.getAllPlayersInGame();
            const gameName = game.getQuizName();
            io.to(socket.id).emit("getSummaryRankListRes", {
                rankList,
                gameName,
            });

            setTimeout(() => {
                io.to(socket.host.room).emit("playerRank", {
                    rankList,
                    gameName,
                });
            }, loadingTime * 1000);
        }
    };

    const hostDisconnect = () => {
        const game = gameManager.getGameWithHost(socket.id);
        if (game) {
            gameManager.removeGame(game.room);
            io.to(socket.host.room).emit("hostDisconnect");
            // console.log(`Host of room ${room} has disconnected`);
        }
    };


    socket.on("hostGame", hostGame); //done
    socket.on("createGame", createGame); //done
    socket.on("deleteQuiz", deleteQuiz);
    socket.on("fetchQuizList", fetchUserQuizList); //done
    socket.on("fetchPlayersInRoom", sendAllPlayersInfoInRoom); //done
    socket.on("startGame", startGame); //done
    socket.on("getQuestion", getQuestion); //done
    socket.on("stopQuestion", stopQuestion);
    socket.on("nextQuestion", nextQuestion);
    socket.on("getRankList", getRankList);
    socket.on("getSummaryRankList", getSummaryRankList); //done
    socket.on("disconnect", hostDisconnect);
    socket.on("getQuiz", getQuiz); //done --> handle by redux
    socket.on("updateQuiz", updateQuiz);
};

export default hostHandle;
