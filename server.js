(function() {
	"use strict";
	var app = require('express')();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	io.on('connection', function(socket) {
		console.log('a user connected', socket.id);

		socket.on('hello', function(data) {
			console.log(data.name + '  said \'hello\'');

			socket.emit('welcome', {
				message: 'welcome ' + data.name
			});
		});

		socket.on('disconnect', function() {
			console.log('user disconnected');
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