var botEnabled = true,
	history = API.getHistory(),
	lastVolume = API.getVolume(),
	isMuted,
	boop = new Audio('https://github.com/Gbear605/Botinator/raw/master/Boop.wav'),
	autowoot = true,
	autojoin = true;

function woot() { $('#woot').click(); }

function meh() { $('#meh').click(); }

function mute() {
	isMuted = true;
	lastVolume = API.getVolume();
	API.setVolume(0);
}

function unmute() {
	isMuted = false;
	API.setVolume(lastVolume);
	lastVolume = 0;
}

function join() { API.djJoin(); }

function checkHistory()
{
	API.chatLog("Your next song is in history!");
    	boop.play();
}

function newChat(data)
{
	var message = data.message.replace(/&#39;/g, "'")
                          	  .replace(/&amp;/g, "&")
                          	  .replace(/&#34;/g, "\"")
                          	  .replace(/&#59;/g, ";")
                          	  .replace(/&lt;/g, "<")
                          	  .replace(/&gt;/g, ">")
                          	  .toLowerCase().split(' '),
	mentioned = message.indexOf("@" + API.getUser().username) !== -1,
	perm      = API.getUser(data.uid).permission;
    
    	console.log("Botinator: " + "[" + data.un + "]" + message);

	//disables joining
	//bouncers+
	//!disable
	if (message.indexOf('!disable') !== -1 && mentioned && API.hasPermission(data.uid, 1) )
	{
    		if(autojoin)
    		{
        		autojoin = false
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
		API.sendChat("@" + data.from + " - Status: Running Botinator (Gbear605's script), autowoot: " + get("autowoot") + ", autojoin: " + get("autojoin"));
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
			for(var i = l; i < message.length; i++)
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
    API.chatLog(user.username + " joined the room.");
}

function userLeft(user)
{
    API.chatLog(user.username + " left the room");
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

    	API.chatLog(data.dj.username + " is playing " + data.media.title + " by " + data.media.author + ". It is " + minutes + " minutes long and " + seconds + " seconds long.");

    	checkHistory();
}

function voteUpdate(data)
{
	if (data.vote == -1)
	{
	    API.chatLog(data.user.username + " mehed.");
	}
}

function curateUpdate(data)
{
	var media = API.getMedia();
	API.chatLog(data.user.username + " curated " + media.author + " - " + media.title + ".");
}

API.chatLog("Botinator Loaded");

API.on(API.CHAT, newChat);

API.on(API.CHAT_COMMAND, newCommand);

API.on(API.USER_JOIN, userJoined);

API.on(API.ADVANCE, nextDJ);

API.on(API.VOTE_UPDATE, voteUpdate);

API.on(API.GRAB_UPDATE, curateUpdate);




