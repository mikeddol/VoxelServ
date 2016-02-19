(function() {
	"use strict";
	// the app might need to have allow-origin headers??
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	var flags = require('flags');

	var Game = require('./game');
	var User = require('./user');

	// Set up flags here (for debugging logger atm)
	flags.defineBoolean('debug', false);
	flags.parse();

	// FIXME: fix game creation
	var game = new Game({
		id: 'test'
	});

	io.on('connection', function(socket) {
		// TODO: Remember to log stuff
		socket.on('request_join', registerUser);

		socket.on('disconnect', function() {
			console.log('user disconnected'); // Needs some edit
			unregisterUser(socket.id);
		});

		socket.on('player_update', updateUser);

		function registerUser() {
			var newUser = game.addUser(socket.id);
			if (newUser) {
				console.log(JSON.stringify(game, 2, null));
				socket.emit('accept_join', newUser);
				io.emit('user_update', game.getUsers());
			} else {
				socket.emit('refuse_join', refuseConnection());
			}
		}

		function unregisterUser(id) {
			if (game.removeUser(id)) {
				socket.broadcast.emit('user_update', game.getUsers());
				console.log(JSON.stringify(game, 2, null));
			}
		}

		function refuseConnection() {
			return {
				status: "Error",
				msg: "Game full!"
			};
		}

		function updateUser(data) {
			if (game.updateUser(data)) {
				io.emit('user_update', game.getUsers());
			}
		}
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});
})();