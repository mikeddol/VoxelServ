var Game = require('./game');

function GameManager() {
	this.games = {};
	this.users = {};
}

GameManager.prototype.createGame = function addGame() {
	var game = new Game();
	this.games[game.id] = game;
	return game;
};

GameManager.prototype.endGame = function endGame(id) {
	if(this.games[id]) {
		this.games[id].time.timeEnd = Date.now();
		return true;
	}
	return false;
};

GameManager.prototype.addUser = function addUser(user) {
	this.users[user.socketid] = user;
};

GameManager.prototype.getUserGame = function getUserGame(socketid) {
	if(this.users[socketid])
		return this.games(this.users[socketid].gameId);
	return false;
};

GameManager.prototype.removeUser = function removeUser(socketid) {
	if(this.users[socketid]){
		delete this.users[socketid];
		return true;
	}
	return false;
};

GameManager.prototype.findGame = function findGame(id) {
	var res = this.games[id];
	if(res) {
		return res;
	}
	return false;
};

GameManager.prototype.findAvailable = function findAvailable() {
	for(var prop in this.games) {
		if(!this.games[prop].isFull()) {
			return this.games[prop];
		}
	}
	return false;
};

module.exports = GameManager;