function User(data) {
	this.uuid = data.uuid;
	this.socketid = data.socketid;
	this.color = data.color;
	this.gameId = data.gameId;
	this.kills = data.kills || 0;
	this.deaths = data.deaths || 0;
	this.pos = data.pos || null;
	this.dead = false;
	this.state = {
		"fow": false,
		"bck": false,
		"lef": false,
		"rig": false,
		"jmp": false,
		"atk": false,
		"cam": {
			"fow": {
				"x": 0,
				"y": 0,
				"z": 0
			},
			"rig": {
				"x": 0,
				"z": 0
			}
		},
		"flr": false
	};
}

User.prototype.update = function update(data) {
	this.kills = data.kills;
	this.deaths = data.deaths;
	this.state = data.state;
	this.pos = data.pos;
	this.dead = data.dead;
};

User.prototype.plusScore = function plusScore() {
	this.kills += 1;
};

User.prototype.plusDeath = function plusDeath() {
	this.deaths += 1;
};

User.prototype.kill = function kill() {
	this.dead = true;
};

User.prototype.respawn = function respawn() {
	this.dead = false;
};

module.exports = User;