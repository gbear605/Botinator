var botEnabled = true,
	history = API.getHistory(),
	nextSong,
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

function checkHistory(command)
{
	if(API.getNextMedia().inHistory == true)
	{
	    API.chatLog("Your next song is in history!");
    	boop.play();
	}
	else if(command)
	{
    	API.chatLog("Your next song is not in history.")
	}
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
    
    	console.log("Botinator: " + "[" + data.uid + "]" + message);

	if(botEnabled)
	{
		//disables joining
	//bouncers+
	//!disable
	if (message.indexOf('!disable') !== -1 && mentioned && API.hasPermission(data.uid, 1) )
	{
    	if(autojoin)
    	{
        	autojoin = false
       		API.sendChat("@" + data.un + " Botinator auto join disabled. To disable the bot, use !botdisable or !botoff");
    	}
    	else
    	{
        	API.sendChat("@" + data.un + " Botinator auto join was already disabled. To disable the bot, use !botdisable or !botoff");
    	}
	}
		
		//disables the bot
	//bouncers+
	//!botdisable || !botoff
	if ((message.indexOf("!botdisable") !== -1 || message.indexOf("!botoff") !== -1) && API.hasPermission(data.fromID, 1) && mentioned)
       	{
		botEnabled = false;
	}
		
		//says the bot's status
	//!status
	if (message.indexOf("!status") !== -1 && mentioned)
	{
		API.sendChat("@" + data.from + " - Status: Running Botinator, autowoot: " + get("autowoot") + ", autojoin: " + get("autojoin"));
		}
	}
}

function newCommand(data)
{
	var message = data.toLowerCase().split(' ');
	var messageTrue = data.split(' ');
	console.log("Botinator: " + message);
	if(botEnabled)
	{
		//disable bot
		// /disable
		if (message[0] == "/disable")
        	{
            		botEnabled = false
        	}

		//check if next song is in history
        	// /nextsong
        	if (message[0] == '/nextsong')
        	{
        		checkHistory(true);
        	}
		
		//disable autojoin
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

		//disable autowoot
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

		//prepares an @ message to all the mods
    	// /mod || /mods
    	if (message[0] == "/mod" || message[0] == "/mods")
    	{
    		var staffList = API.getStaff();
    		var modString = "";
    		var i;
    		var additionalText = "";
    		for (i = 0; i < staffList.length; i++)
    		{
        		if (staffList[i].permission != 1 && staffList[i].status != 1)
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

		if(message[0] == "/mute")
        {
           	mute();
        }

        if(message[0] == "/unmute")
        {
            unmute();
        }

		if(message[0] == "/join")
		{
			join();
		}
	}

    //enable bot
    // /enable
    if (message[0] == '/enable')
    {
    	enable(true);
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
	if(autowoot) {
		woot();
	}
	if(autojoin) {
		join();
	}

	var minutes = Math.floor(data.media.duration / 60);
    var seconds = data.media.duration - (minutes * 60);

    API.chatLog(data.dj.username + " is playing " + data.media.title + " by " + data.media.author + ". It is " + minutes + " minutes long and " + seconds + " seconds long.");

	if(data.media.duration > 600)
    {
        boop.play();
    }

    checkHistory(false);
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




