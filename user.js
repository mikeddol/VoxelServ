function User(data) {
	this.uuid = data.uuid;
	this.socketid = data.socketid;
	this.color = data.color;
	this.kills = data.kills || 0;
	this.deaths = data.deaths || 0;
	this.pos = data.pos || null;
	this.rot = data.rot || null;
}

User.prototype.update = function update(data) {
	this.kills = data.kills;
	this.deaths = data.deaths;
	this.pos = data.pos;
	this.rot = data.rot;
};

module.exports = User;
