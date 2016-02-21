var Game = require('./game');

function GameManager() {
	this.games = [];
	this.users = {};
}

GameManager.prototype.createGame = function addGame() {
	var game = new Game();
	this.games.push(game);
	return game;
}

GameManager.prototype.endGame = function endGame(id) {
	for (var u = 0; u < this.games.length; u++) {
		if (this.games[u].id === id) {
			this.games[u].time.timeEnd = Date.now();
			return true;
		}
	}
	return false;
}

GameManager.prototype.addUser = function addUser(user) {
	this.users[user.socketid] = user;
}

GameManager.prototype.getUserGame = function getUserGame(socketid) {
	if(this.users[socketid])
		return this.findGame(this.users[socketid].gameId);
	return false;
}

GameManager.prototype.removeUser = function removeUser(socketid) {
	if(this.users[socketid]){
		delete this.users[socketid];
		return true;
	}
	return false;
}

GameManager.prototype.findGame = function findGame(id) {
	for (var u = 0; u < this.games.length; u++) {
		if (this.games[u].id === id) {
			return this.games[u];
		}
	}
	return false;
}

GameManager.prototype.findAvailable = function findAvailable() {
	for (var u = 0; u < this.games.length; u++) {
		if (!this.games[u].isFull()) {
			return this.games[u];
		}
	}
	return false;
}

module.exports = GameManager;