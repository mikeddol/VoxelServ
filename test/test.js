var assert = require('chai').assert;

describe('Game', function() {
	var game = {};
	beforeEach("reinitialise the game object", function() {
		game = new(require('../game'))();
	});

	it('should start with 0 users online', function() {
		assert.equal(0, game.online);
	});

	describe('#addUser()', function() {
		it('should return a new user if successful', function() {
			assert.isOk(game.addUser('testId'));
		});

		it('should increase the number of online users', function() {
			game.addUser('testId');
			assert.equal(1, game.online);
		});

		it('should return null if unsuccessful', function() {
			game.online = 4;
			assert.equal(null, game.addUser('testId'));
		});
	});

	describe('#removeUser()', function() {
		beforeEach('add a user', function() {
			game.addUser('testId');
		});

		it(`should return the uuid of the removed user if successful`,
			function() {
				assert.isNotFalse(game.removeUser('testId'));
			});

		it('should return false if removing user is unsuccessful', function() {
			assert.isFalse(game.removeUser("testId2"));
		});

		it('should decrease the number of online users', function() {
			game.removeUser('testId');
			assert.equal(0, game.online);
		});
	});

	describe('#getGame()', function() {
		it('should return the game object', function() {
			assert.isOk(game.getGame());
		});
	});

	describe('#getUsers()', function() {
		it('should return an empty object if no users are connected',
			function() {
				assert.equal(0, Object.keys(game.getUsers()).length);
			});

		it('should return one object if one single user joined the game',
			function() {
				game.addUser('testId');
				assert.equal(1, Object.keys(game.getUsers()).length);
			});
	});

	describe('#getColour()', function() {
		it('should return yellow if the user joining is first in the game',
			function() {
				assert.equal('yellow', game.getColour('testId'));
			});

		it('should return red if user joining is second in the game',
			function() {
				game.getColour('testId');
				assert.equal('red', game.getColour('testId2'));
			});

		it('should an empty string if all colours are taken', function() {
			for (var i = 0; i < 4; i++) {
				game.getColour('testId' + i);
			}
			assert.equal("", game.getColour('testid5'));
		});
	});

	describe('#killUser()', function() {
		var user = {};
		beforeEach('add a user to the game', function() {
			user = game.addUser('testId');
			game.killUser(user.uuid);
		});

		it('should set the user dead state to true', function() {
			assert.isTrue(user.dead);
		});

		it('should increase the deaths count of the user', function() {
			assert.equal(1, user.deaths);
		});
	});

	describe('#respawnUser()', function() {
		it('should  reset the dead state of the user to true',
			function() {
				var user = game.addUser('testId');
				game.killUser(user.uuid);
				game.respawnUser(user.uuid);
				assert.isFalse(user.dead);
			});
	});

	describe('#rewardUser()', function() {
		it('should increase the kills count of the user', function() {
			var user = game.addUser('testId');
			game.rewardUser(user.uuid);
			assert.equal(1, user.kills);
		});
	});
});