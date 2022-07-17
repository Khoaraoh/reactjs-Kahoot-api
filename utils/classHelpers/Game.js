class Game {
    constructor(room, hostId, gameData) {
        this.room = room || "";
        this.listPlayers = [];
        this.host = hostId || "";
        this.start = false;
        this.gameData = gameData;
        this.currentQuestionIndex = 0;
        this.answers = this.gameData.questions.map((question) => {
            return {
                id: question.id,
                playerAnswers: []
            }
        })
    }

    increaseQuestionIndex(){
        ++this.currentQuestionIndex;
    }

    getPlayer(playerId) {
        return this.listPlayers.find((player)=>player.id === playerId);
    }

    getQuestion() {
        return {
            questionData: this.gameData.questions[this.currentQuestionIndex],
            questionIndex: this.currentQuestionIndex,
            questionLength: this.gameData.questions.length,
            quizName: this.getQuizName(),
        }
    }

    getAnswer() {
        return this.answers[this.currentQuestionIndex];
    }

    addPlayerToGame(player){
        this.listPlayers.push(player);
    }

    getAllPlayersInGame(){
        return this.listPlayers;
    }

    removePlayer(playerId) {
        this.listPlayers = this.listPlayers.filter(player => player.id !== playerId)
    }

    hasPlayer(playerId) {
        return this.listPlayers.find(player=>player.id === playerId)
    }

    getHost() {
        return this.host;
    }

    startGame() {
        this.start = true;
        return this.start;
    }

    getQuizName() {
        return this.gameData.name;
    }

    updatePlayerAnswer(playerId, questionId, answer, index) {
        const question = this.gameData.questions.find(question=>question.id === questionId);
        if(question){
            const questionAnswer = this.answers.find(ans => ans.id === questionId);
            this.answers.forEach(ans => {
                if(ans.id === questionId){
                    ans.playerAnswers.push({
                        player: playerId,
                        answer,
                        index
                    })
                }
            })

            if(answer === question.correctAnswer){
                const index = questionAnswer.playerAnswers.length;
                const newScore = 1000 - (index-1) * 20;

                this.listPlayers.forEach(player=>{
                    if(playerId === playerId){
                        player.score += newScore;
                    }
                })

                this.listPlayers.sort((a,b) => b.score - a.score);
            }
        }

        return this.getAnswer();
    }
}

export default Game;