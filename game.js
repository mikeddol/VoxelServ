var User = require('./user');
var uuid = require('uuid');

function Game(data) {
	this.id = uuid.v1();
	this.time = {
		timeStarted: Date.now(),
		timeEnd: Date.now()
	};
	this.users = [];
	this.online = 0;
	this.maxSize = 4;
	this.colours = {
		'black': '',
		'red': '',
		'blue': '',
		'green': ''
	};
}

Game.prototype.addUser = function addUser(socketid) {
	var color = this.getColour(socketid);
	if (!this.isFull() && color) {
		var id = this.id;
		var newUser = new User({
			uuid: uuid.v4(),
			socketid: socketid,
			color: color,
			gameId: id
		});
		this.users.push(newUser);
		this.updateOnline();
		return newUser;
	} else {
		return null;
	}
};

Game.prototype.removeUser = function removeUser(socketid) {
	for (var u = 0; u < this.users.length; u++) {
		if (this.users[u].socketid === socketid) {
			var uuid = this.users[u].uuid;
			delete this.users[u];
			this.users.splice(u, 1);
			this.freeColour(socketid);
			this.updateOnline();
			return uuid;
		}
	}
	return false;
};

Game.prototype.isFull = function isFull() {
	return this.online === this.maxSize;
};

Game.prototype.updateOnline = function updateOnline() {
	this.online = this.users.length;
};

Game.prototype.getGame = function getGame() {
	return this;
};

Game.prototype.getUsers = function getUsers() {
	return this.users;
};

Game.prototype.updateUser = function updateUser(user) {
	for (var u = 0; u < this.users.length; u++) {
		if (this.users[u].uuid === user.uuid) {
			this.users[u].update(user);
			return true;
		}
	}
	return false;
};

Game.prototype.getColour = function getColour(id) {
	for (var c in this.colours) {
		if (this.colours[c] === "") {
			this.colours[c] = id;
			return c;
		}
	}
	return "";
};

Game.prototype.freeColour = function freeColour(id) {
	for (var c in this.colours) {
		if (this.colours[c] === id) {
			this.colours[c] = "";
			break;
		}
	}
};

module.exports = Game;