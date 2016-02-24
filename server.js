(function() {
	"use strict";
	// the app might need to have allow-origin headers
	// once it sits on a server. Maybe.
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	var flags = require('flags');

	var GameManager = require('./game_manager');

	// Set up flags here (for debugging logger atm)
	flags.defineBoolean('debug', false);
	flags.parse();
	var debug = flags.get('debug');

	var gameMan = new GameManager();

	io.on('connection', function(socket) {
		socket.on('request_join', registerUser);

		socket.on('disconnect', function() {
			unregisterUser(socket.id);
		});

		socket.on('player_update', updateUser);

		function registerUser(data) {
			if (debug)
				console.log("User at socket", socket.id, "is attempting a connection.");

			var game = {};
			if (data && data.gameId) {
				game = gameMan.findGame(data.gameId);
				if (debug && game)
					console.log("Reconnected user at socket", socket.id, "to game", data.gameId + ".");
			}
			if (!game || !data) {
				game = gameMan.findAvailable();

				if (!game) {
					game = gameMan.createGame();

					if (debug)
						console.log("Created new game", game.id, "in gameMan.");
				} else {
					if (debug)
						console.log("Found game", game.id, "in gameMan.");
				}
			}

			var newUser = game.addUser(socket.id);
			if (newUser) {
				if (debug)
					console.log("User at socket", socket.id, "successfully added to game", game.id + ".");
				gameMan.addUser(newUser);
				socket.join(newUser.gameId);
				socket.emit('accept_join', newUser);
				updateUser(newUser);
			} else {
				if (debug)
					console.log("User at socket", socket.id, "could not be added to the game", game.id + ".");
				socket.emit('refuse_join', refuseConnection());
			}
		}

		function unregisterUser(id) {
			var game = gameMan.getUserGame(id);
			if (!game && debug) {
				console.log("User can't disconnect from nonexistent game.");
			} else if (game) {
				var uuid = game.removeUser(id);
				if (uuid) {
					if (debug)
						console.log("User at socket", id, "disconnected from game", game.id + ".");
					socket.broadcast.to(game.id).emit('remove_user', uuid);
				} else {
					if (debug)
						console.log("User", id, "could not be removed from game", game.id + ".");
				}
			}
		}

		function refuseConnection() {
			return {
				status: "Error",
				msg: "Game full!"
			};
		}

		function updateUser(user) {
			var game = gameMan.findGame(user.gameId);
			if (game) {
				if (game.updateUser(user)) {
					socket.broadcast.to(game.id).emit('user_update', game.getUsers());
				}
			}
		}
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});
})();