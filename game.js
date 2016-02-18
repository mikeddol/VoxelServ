var User = require('./user');
var uuid = require('uuid');

function Game(data) {
	this.id = data.id;
	this.time = {
			timeStarted: data.timeStarted || Date.now(),
			timeCurrent: data.timeStarted || Date.now(),
			timeEnd: data.timeEnd || Date.now()
		},
		this.users = data.users || [];
	this.online = data.online || 0;
	this.maxSize = data.maxSize || 4;
}

Game.prototype.addUser = function addUser(socketid) {
	var color = getColour(socketid);
	if (!this.isFull() && color) {
		var newUser = new User({
			uuid: uuid.v4(),
			socketid: socketid,
			color: color
		});
		this.users.push(newUser);
		this.updateOnline();
		return newUser;
	} else {
		return null;
	}
}

Game.prototype.removeUser = function removeUser(socketid) {
	for (var u = 0; u < this.users.length; u++) {
		if (this.users[u].socketid === socketid) {
			delete this.users[u];
			this.users.splice(u, 1);
			freeColour(socketid);
			this.updateOnline();
			return true;
		}
	}
	return false;
}

Game.prototype.isFull = function isFull() {
	return this.online === this.maxSize;
}

Game.prototype.updateOnline = function updateOnline() {
	this.online = this.users.length;
}

Game.prototype.getGame = function getGame() {
	return this;
}

Game.prototype.getUsers = function getUsers() {
	return this.users;
}

Game.prototype.updateUser = function updateUser(user) {
	for (var u = 0; u < this.users.length; u++) {
		if (this.users[u].uuid === user.uuid) {
			this.users[u].update(user);
			return true;
		}
	}
	return false;
}

var colour = {
	'black': '',
	'red': '',
	'blue': '',
	'green': ''
};

function getColour(id) {
	for (var c in colour) {
		if (colour[c] === "") {
			colour[c] = id;
			return c;
		}
	}
	return "";
}

function freeColour(id) {
	for (var c in colour) {
		if (colour[c] === id) {
			colour[c] = "";
			break;
		}
	}
}

module.exports = Game;
