class GameManager {
    constructor(){
        this.listGames = [];
        this.availableId = new Date().getMilliseconds().toString() + Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();
    }

    getGameWithHost(hostId) {
        return this.listGames.find(game=>game.host === hostId)
    }

    getGame(roomId){
        return this.listGames.find(game=> game.room === roomId)
    }

    getGameWithPlayer(playerId){
        return this.listGames.find(game=>game.hasPlayer(playerId))
    }

    addGame(game){
        this.listGames.push(game)
    }
    getNextAvailableId(){
        const nextId = +this.availableId + 1;
        this.availableId = nextId.toString();
        return nextId.toString();
    }
    removeGame(game) {
        this.listGames = this.listGames.filter(item => item.roomId !== game.roomId)
    }
}
const gameManager = new GameManager();
export default gameManager;