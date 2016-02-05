(function() {
	"use strict";
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	var game = require('./game');
	var user = require('./user');
	// the app might need to have allow-origin headers??

	io.on('connection', function(socket) {
		// TODO: Remember to log stuff
		socket.on('request_join', addUser);

		socket.on('disconnect', function() {
			console.log('user disconnected'); // Needs some edit
			removeUser(socket.id);
			updateOnline();
		});

		function addUser(usr) {
			if (!isFull()) {
				game.user_manager.users.push({
					id: socket.id,
					color: usr.color
				});
				updateOnline();
				console.log(JSON.stringify(game, 2, null));
				io.emit('user_joined', getUsers());
			} else {
				socket.emit('refuse_join', refuseConnection());
			}
		}

		function removeUser(id) {
			game.user_manager.users = game.user_manager.users.filter(function(user) {
				if (user.id !== id) {
					return user;
				}
			});
			updateOnline();
			console.log(JSON.stringify(game, 2, null));
		}

		function updateOnline() {
			game.user_manager.online = game.user_manager.users.length;
		}

		function isFull() {
			return game.user_manager.online === game.full;
		}

		function refuseConnection() {
			return {
				status: "Error",
				msg: "Game full!"
			};
		}

		function getGame() {
			return game;
		}

		function getUsers() {
			return game.user_manager.users;
		}

		function getUsers() {
			return game.user_manager.users;
		}
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});
})();