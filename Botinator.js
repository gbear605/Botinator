function cleanUpText(text) {
	return text.replace(/&#8238;/g, "")
}

var lastVolume = API.getVolume(),
	isMuted,
	joinTimeout,
	boop = new Audio('https://github.com/Gbear605/Botinator/raw/master/Boop.wav'),
	autowoot = true,
	autojoin = true,
	tempMuted = false;

function woot() { $('#woot').click(); }

function meh() { $('#meh').click(); }

function mute() {
	isMuted = true;
	lastVolume = API.getVolume();
	API.setVolume(0);
	API.chatLog("Mute started");
}

function unmute() {
	isMuted = false;
	API.setVolume(lastVolume);
	lastVolume = 0;
	tempMuted = false;
	API.chatLog("Mute ended");
}

function tempMute() {
	mute();
	tempMuted = true;
	API.chatLog("Temporary mute started");
}

function unTempMute() {
	unmute();
	tempMuted = false;
	API.chatLog("Temporary mute ended");
}

function join() { API.djJoin(); }

var lastCheckName = "";

function newChat(data)
{
	if(data.un != null) {
		data.un = cleanUpText(data.un)
	}
	var message = cleanUpText(data.message).replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&#34;/g, "\"").replace(/&#59;/g, ";").replace(/&lt;/g, "<").replace(/&gt;/g, ">").toLowerCase().split(' '),
	mentioned = message.indexOf("@" + API.getUser().username) !== -1;
    	
    
    	if(mentioned) {
    		console.log("We just got pinged!");
		//API: https://developer.mozilla.org/en-US/docs/Web/API/Notification/
		if (Notification){
			if (Notification.permission !== "granted") {
				Notification.requestPermission();
			} else {
				var mentionNotification = new Notification('Botinator', {body: "You've been pinged by " + data.un + "!"});
				mentionNotification.onclick = function () {
					$('#chat-input-field').val("@" + data.un + " ");
				};
				boop.play();
			}
		}
    	}
    
    	var textOfMessage = '';
	for (var i = 0; i < message.length; i++) {
	   textOfMessage += message[i] + ' ';
	}
	if(data.un === undefined) {
    		console.log("Botinator: " + textOfMessage);
	}
	else {
    		console.log("Botinator: " + "[" + data.un + "] " + textOfMessage);
	}
	
	if(message.indexOf("!afkcheck") !== -1) {
            lastCheckName = data.un;
            console.log("User: " + data.un + " just sent an afk check");
            return;
        }
        
        if(mentioned && message.indexOf("afk check") !== -1 && data.un == "Bot") {
            console.log("Bot just afk checked us!");
            //API: https://developer.mozilla.org/en-US/docs/Web/API/Notification/
            if (Notification){
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                } else {
                    var afkNotification = new Notification('Botinator', {body: "You've been sent an AFK check message by " + lastCheckName + "!"});
                    afkNotification.onclick = function () {
                        $('#chat-input-field').val("!" + lastCheckName + "check");
                    };
                }
            }
        }
        
	//disables joining
	//bouncers+
	//!disable
	if (message.indexOf('!disable') !== -1 && mentioned && API.hasPermission(data.uid, 1) )
	{
    		if(autojoin)
    		{
        		autojoin = false;
       			API.sendChat("@" + data.un + " Botinator auto join disabled.");
    		}
    		else
    		{
        		API.sendChat("@" + data.un + " Botinator auto join was already disabled.");
    		}
	}
		
	//says the bot's status
	//!status
	if (message.indexOf("!status") !== -1 && mentioned)
	{
		API.sendChat("@" + data.un + " - Status: Running Botinator (Gbear605's script), autowoot: " + autowoot + ", autojoin: " + autojoin);
	}
}

function newCommand(data)
{
	var message = data.toLowerCase().split(' ');
	var messageTrue = data.split(' ');
	console.log("Botinator: " + message);

	//Displays a help message
	// /man || /? || /commands
	if (message[0] == "/man" || message[0] == "/?" || message[0] == "/commands")
	{
		API.chatLog("/j - toggles autojoin");
		API.chatLog("/w - toggles autowoot");
		API.chatLog("/mute - toggles mute");
		API.chatLog("/mod || /mods [all] [message] - prepares or sends an @ message to all the mods (decision based on [all] toggle)");
	}
	
	//toggle autojoin
	// /j
	if (message[0] == '/j')
	{
		if (autojoin)
		{
	    		autojoin = false;
	    		API.chatLog("auto join disabled");
		}
		else
		{
	    		autojoin = true;
	    		API.chatLog("auto join enabled");
		}
	}
	
	//sets autojoin timer 
	// /jtime <time | minutes>
	if (message[0] == '/jtime' && message.length > 2)
	{
		time_minutes = message[1]
		time = time_minutes * 60 * 1000;
    		autojoin = true;
    		API.chatLog("auto join with timeout of " + time_minutes + " started");
		joinTimeout = setTimeout(function() {
			autojoin = false;	
		}, time);
	}
	
	//clears autojoin timer 
	// /jclear
	if (message[0] == '/jclear')
	{
    		API.chatLog("auto join timeout cleared");
		clearTimeout(joinTimeout);
	}
	
	//toggle autowoot
	// /w
	if (message[0] == '/w')
	{
	    	if (autowoot)
	    	{
			autowoot = false;
			API.chatLog("auto woot disabled");
	    	}
	    	else
	    	{
			autowoot = true;
			API.chatLog("auto woot enabled");
	    	}
	}
	
	//prepares or sends an @ message to all the mods (decision based on [all] toggle)
	// /mod || /mods [all] [message]
	if (message[0] == "/mod" || message[0] == "/mods")
	{
		var staffList = API.getStaff();
		var modString = "";
		var i;
		var additionalText = "";
		for (i = 0; i < staffList.length; i++)
		{
			if (staffList[i].role != API.ROLE.DJ && staffList[i].username != "Bot")
			{
			    modString = modString + " @" + staffList[i].username;
			}
		}
		
		if(message.length > 1)
		{
			var l;
			if (message[1] == "true" || message[1] == "all" || message[1] == "public" || message[1] == "chat")
			{
			    	l = 2;
			}
			else
			{
				l = 1;
			}
			for(i = l; i < message.length; i++)
			{
		   		additionalText = additionalText + " " + messageTrue[i];
			}
		}
		
		if (message[1] == "true" || message[1] == "all" || message[1] == "public" || message[1] == "chat")
		{
			API.sendChat(modString + " !alert" + additionalText);
		}
		else
		{
			API.chatLog(modString + " !alert" + additionalText);
		}
	}
		
	//Boop!
	// /boop
	if(message[0] == "/boop")
	{
		boop.play();
	}
	
	//Toggles mute
	// /mute
	if(message[0] == "/mute")
	{
	   	if (isMuted)
	    	{
			unmute();
	    	}
	    	else
	    	{
			mute();
	    	}
	}
	
	//Toggles temp mute
	// /mute
	if(message[0] == "/tempmute")
	{
	   	if (tempMuted)
	    	{
			unTempMute();
	    	}
	    	else
	    	{
			tempMute();
	    	}
	}
	
	//Joins DJ List
	// /join
	if(message[0] == "/join")
	{
		join();
	}
	
	//Mehs
	// /meh
	if(message[0] == "/meh")
	{
		meh();
	}
	
	//Woots
	// /woot
	if(message[0] == "/woot")
	{
		woot();
	}
}

function userJoined(user)
{
    API.chatLog(cleanUpText(user.username) + " joined the room.");
}

function userLeft(user)
{
    API.chatLog(cleanUpText(user.username) + " left the room");
}

function nextDJ(data)
{
	if(autowoot) 
	{
		woot();
	}
	if(autojoin) 
	{
		join();
	}

	var minutes = Math.floor(data.media.duration / 60);
	var seconds = data.media.duration - (minutes * 60);
    	API.chatLog(cleanUpText(data.dj.username) + " is playing " + cleanUpText(data.media.title) + " by " + cleanUpText(data.media.author) + ". It is " + minutes + " minutes long and " + seconds + " seconds long.");
	if(tempMuted) {
		unTempMute();
	}
}

function voteUpdate(data)
{
	if (data.vote == -1)
	{
	    API.chatLog(cleanUpText(data.user.username) + " mehed.");
	}
}

function curateUpdate(data)
{
	var media = API.getMedia();
	API.chatLog(cleanUpText(data.user.username) + " curated " + cleanUpText(media.author) + " - " + cleanUpText(media.title) + ".");
}

API.chatLog("Botinator Loaded");

API.on(API.CHAT, newChat);

API.on(API.CHAT_COMMAND, newCommand);

API.on(API.USER_JOIN, userJoined);

API.on(API.USER_LEAVE, userLeft);

API.on(API.ADVANCE, nextDJ);

API.on(API.VOTE_UPDATE, voteUpdate);

API.on(API.GRAB_UPDATE, curateUpdate);





