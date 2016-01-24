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
	});

	http.listen(3000, function() {
		console.log('listening on *:3000');
	});
})();