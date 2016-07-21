/* jshint esversion: 6 */

var assert = require('chai').assert;

describe('Game', function() {
	var game = {};
	beforeEach("reinitialise the game object", function() {
		game = new (require('../game'))();
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
});