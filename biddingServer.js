var socketServer = require('socket.io').listen(7798); /*any port can be used*/
var registeredUsers = []; /* array of resgistered users objects*/


socketServer.sockets.on('connection', function (socket) {

	socket.on('addUser', function (userId) { /*userid must be unique that will be set in session when the user will login*/
		var addUserFlag  = 1;

		for( var i=0, len=registeredUsers.length; i<len; ++i ){
                var s = registeredUsers[i];

                if(s.userId == userId){

					registeredUsers.splice(i,1);

					var user = new Object();
					user.userId = userId;
					user.socketId = socket.id;
					user.socketref = socket;

					registeredUsers.push(user);

					addUserFlag  = 0;

					break;
                }
            }

		if(addUserFlag  == 1) {
                  var user = new Object();
                  user.userId = userId;
                  user.socketId = socket.id;
                  user.socketref = socket;

                  registeredUsers.push(user);
		}



      console.log("total active users now: "+registeredUsers.length);

    });

	socket.on('disconnect', function (data) {

		for( var i=0, len=registeredUsers.length; i<len; ++i ){
			var s = registeredUsers[i];


			if(s.socketId == socket.id){

				registeredUsers.splice(i,1);
				break;
			}
		}

		console.log("remaining users now: "+registeredUsers.length);

	});

	/*this function changes yellow screen of the station to blue screen when a test is assigned on that machine.*/
	socket.on('biddingDone', function (userId) {


		for( var i=0, len=registeredUsers.length; i<len; ++i ){
			var r = registeredUsers[i];
			if(r.userId == userId){
				var tosend = r;
				break;
			}

		}
		try {
			var tosendsocket = tosend.socketref ;
			tosendsocket.emit('showBidToUser',userId);
		}catch(err){
			console.log (err);
		}


	});



});