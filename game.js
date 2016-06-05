var User = require('./user');
var uuid = require('uuid');

function Game(data) {
	this.id = uuid.v1();
	this.time = {
		timeStarted: Date.now(),
		timeEnd: Date.now()
	};
	this.users = {};
	this.online = 0;
	this.maxSize = 4;
	this.colours = {
		'yellow': '',
		'red': '',
		'blue': '',
		'green': ''
	};
	this.collisionHolder = {};
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
		this.users[newUser.uuid] = newUser;
		this.updateOnline();
		return newUser;
	} else {
		return null;
	}
};

Game.prototype.removeUser = function removeUser(socketid) {
	for (var uuid in this.users) {
		if (this.users[uuid].socketid === socketid) {
			delete this.users[uuid];
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
	this.online = Object.keys(this.users).length;
};

Game.prototype.getGame = function getGame() {
	return this;
};

Game.prototype.getUsers = function getUsers() {
	return this.users;
};

Game.prototype.updateUser = function updateUser(user) {
	if (this.users[user.uuid]) {
		this.users[user.uuid].update(user);
		return true;
	}
	return false;
};

Game.prototype.handleCollision = function handleCollision(data) {
	if (this.collisionHolder[data.deadId]) {
		if (data.time - this.collisionHolder[data.deadId].time <= 200) {
			this.killUser(data.deadId);
			this.rewardUser(data.winId);
			delete this.collisionHolder[data.deadId];
			return true;
		} else {
			delete this.collisionHolder[data.deadId];
			return false;
		}
	} else {
		this.collisionHolder[data.deadId] = data;
	}
	return 'waiting';
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

Game.prototype.killUser = function killUser(uuid) {
	this.users[uuid].dead = true;
	this.users[uuid].deaths += 1;
};

Game.prototype.respawnUser = function respawnUser(uuid) {
	this.users[uuid].dead = false;
};

Game.prototype.rewardUser = function rewardUser(uuid) {
	this.users[uuid].kills += 1;
};

module.exports = Game;