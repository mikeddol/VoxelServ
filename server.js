(function() {
	"use strict";
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	var uuid = require('uuid');

	var game = require('./game');
	var user = require('./user');
	// the app might need to have allow-origin headers??

	var colour = {
		'black': '',
		'red': '',
		'blue': '',
		'green': ''
	};

	io.on('connection', function(socket) {
		// TODO: Remember to log stuff
		socket.on('request_join', addUser);

		socket.on('disconnect', function() {
			console.log('user disconnected'); // Needs some edit
			removeUser(socket.id);
			updateOnline();
		});

		function addUser() {
			var color = getColour(socket.id);
			var newUser = null;
			if (!isFull() && color) {
				newUser = {
					id: uuid.v4(),
					socketid: socket.id,
					color: color
				};
				game.user_manager.users.push(newUser);
				updateOnline();
				console.log(JSON.stringify(game, 2, null));
				socket.emit('accept_join', newUser);
				io.emit('user_update', getUsers());
			} else {
				socket.emit('refuse_join', refuseConnection());
			}
		}

		function getColour(id) {
			for (var c in colour) {
				if (colour[c] === "") {
					colour[c] = id;
					return c;
				}
			}
			return "";
		}

		function removeUser(id) {
			game.user_manager.users = game.user_manager.users.filter(function(user) {
				if (user.socketid !== id) {
					return user;
				}
			});
			for (var c in colour) {
				if (colour[c] === id) {
					colour[c] = "";
					break;
				}
			}
			updateOnline();
			io.emit('user_update', getUsers());
			console.log(JSON.stringify(game, 2, null));
		}

		function updateOnline() {
			game.user_manager.online = game.user_manager.users.length;
		}

		function isFull() {
			return game.user_manager.online === game.maxSize;
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