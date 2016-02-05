(function() {
	"use strict";
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	var game = require('./game');
	var user = require('./user');
	// the app might need to have allow-origin headers??

	io.on('connection', function(socket) {
		console.log('a user connected ', socket.id);

		socket.on('user_join', addUser);

		console.log(JSON.stringify(game, 2, null));

		io.emit('user_join', getGame());

		socket.on('disconnect', function() {
			console.log('user disconnected'); // Needs some edit
			removeUser(socket.id);
			updateOnline();
		});

		function addUser(usr) {
			console.log(usr);
			if(!game.full) {
				game.user_manager.users.push({
					id: usr.id,
					color: usr.color
				});
				updateOnline();
			}
		}
		function removeUser(id) {
			game.user_manager.users = game.user_manager.users.filter(function (user) {
				if(user.id != id) {
					return user;
				}
			});
		}

		function updateOnline() {
			game.user_manager.online = game.user_manager.users.length;
		}

		function getGame() {
			return game;
		}

		function getUsers() {
			return game.user_manager.users;
		}
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});
})();