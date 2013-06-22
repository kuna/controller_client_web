
function connect() {
	this.initialized = false;
	
	this.host = "ws://218.54.45.177:1240"
	//this.host = "ws://localhost:1240/"
	//this.host = "ws://147.46.240.46:1240/"
	
	this.initialize = function() {
		debug("start init");
		
		try {
			this.socket = new WebSocket(this.host);
			this.socket.onopen = function() {
				// this must happen first!!
				mode_change(MODE_JOIN);
				sock.initialized = true;
				debug("connected");
			}
			
			this.socket.onmessage = function(msg) {
				// onreceive
				debug(msg.data);
				
				lines = msg.data.split(/\r\n|\r|\n/g);
				for (i=0; i<lines.length; i++) {
					if (lines[i] == "") continue;
					sock.OnMessage(lines[i]);
				}
			}
			
			this.socket.onclose = function() {
				// onclose then stop the page
				CleanUp();
				debug("closed");
				return -1;
			}
		} catch (e) {
			// error happening...?
			alert(e);
			return false;
		}
		return true;
	}
	
	this.OnMessage = function(str) {
		// common commands
		args = str.split(" ");
		if (args[0] == "CLOSE") {
			Disconnect();
		}
		if (args[0] == "QUIT") {
			// to original state
			stopSensorTimer();
			hideController();
			showJoin();
			sock.setOnMessage(OnJoinWebHandler);
		}
		if (args[0] == "MODIFY") {
			loadLayout(args[3]);
		}
		if (args[0] == "RESULT") {
			if (args[3] == "0") {
				loadLayout("lose");
			} else if (args[3] == "1") {
				loadLayout("win");
			}
		}
		
		// do custom functions
		this.OnCustomMessage(args);
	}
	
	this.OnCustomMessage = function(args) {
		// null function
	}
	
	this.setOnMessage = function(f) {
		this.OnCustomMessage = f;
	}
	
	// dont send duplicate message...
	this._msg = "";
	this.send = function (str) {
		try {
			if (this._msg == str) {
				return;
			}
			this._msg = str;
			this.socket.send(str + "\n");
		} catch(e) {
			alert(e);
		}
	}
	
	function message(str) {
		/* do case with message */
		handler.sendHandler(str.split(' '));
	}
}
// socket part end