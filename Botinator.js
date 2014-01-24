var botEnabled = true;

var canterlockUsers = {};
var capslockrepetition = 2;
var capslockOn = false;

var autowoot = true;
var autojoin = true;

var history = API.getHistory();

function nextEpisode()
{
    var nextEpisodeAPISite = "http://api.ponycountdown.com/next"
    var nextEpisodeAPISite = "http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"" + nextEpisodeAPISite + "\"&format=json";
    var nextepisodeJSON = $.getJSON(nextEpisodeAPISite,function ()
        {
            var nextEpisodeName = nextepisodeJSON.responseJSON.query.results.json.name;
            API.sendChat("The next episode is \"" + nextEpisodeName + "\"" );
        });
}

function canterlock(data)
{
    var userfrom = data.from;

    //check whether this is the first time using canterlock
    if (userfrom in canterlockUsers)
    {
        canterlockUsers[userfrom] += 1;
    }
    else
    {
        canterlockUsers[userfrom] = 1;
    }

    if (canterlockUsers[userfrom] % capslockrepetition === 1)
    {
        API.sendChat("!rule 8 @" + userfrom + " has used canterlock " + canterlockUsers[userfrom] + " times.");
    }
}

function enable(privateCommand)
{
    botEnabled = true;
    if (privateCommand)
    {
        API.chatLog("Botinator Enabled.");
    }
    else
    {
        API.sendChat("Botinator Enabled.");
    }
    privateCommand = null;
}

function disable(privateCommand)
{
    botEnabled = false;
    if (privateCommand)
    {
        API.chatLog("Botinator Disabled.");
    }
    else
    {
        API.sendChat("Botinator Disabled.");
    }
    privateCommand = null;
}

function checkHistory()
{
    history = API.getHistory();
    nextSongInHistory = false;
    nextSong = API.getNextMedia();
    for(var i = 0; i < history.length; i++)
    {
        if(nextSong.media.cid == history[i].media.cid)
        {
            API.chatLog("Next song in history!");
            nextSongInHistory = true;
        }
        
    }
}

function newChat(data)
{
	message = data.message.toLowerCase().split(' ');
	console.log(message);
    if (botEnabled)
    {
        //Tells the source code for the bot
        //!source || !sourcecode
        if (message[0] == '!source'
            || data.message.toLowerCase().indexOf('!sourcecode') > -1)
        {
            var sourceCodeSite = "https://github.com/Gbear605/Botinator";
            API.sendChat("The sourcecode for Botinator, gbear605's bot, can be found at " + sourceCodeSite);
        }

        //Tells the next my little pony episode using Yahoo APIs and PonyCountdown APIs
        //!nextepisode || !nextep || !next
        if (message[0] == '!nextepisode' 
            || message[0] == '!nextep' 
            || message[0] == '!next')
        {
            nextEpisode();
        }

        //Anti canterlock bot stuff
        if (data.message.toUpperCase() === data.message 
            && data.message.length > 5 
            && capslockOn === true)
        {
            canterlock(data);
        }

        //says how many points the user needs to get the next level of avatars
        //!points || !pts
        if (message[0] == '!points'
        	|| message[0] == '!pts')
        {
            API.sendChat("@" + data.from + " Botinator's point checker is not done yet. This is a placeholder command.");
        }

        //disables the bot
        //bouncers+
        //!disable
        if (message[0] == '!disable' 
            && API.hasPermission(data.fromID, 1) 
            && message[1] == ('@' + API.getUser().username ) )
        {
            disable(false);
        }

        //says the bot's status
        //!status
        if (message[0] == '!status'
            && 
            (
                message[1] == ( '@' + API.getUser().username )
                || message[1] == ( API.getUser().username ) 
            )
           )
        {
            API.sendChat("@" + data.from + " - Status: Running Botinator, autowoot: " + autowoot + ", autojoin: " + autojoin);
        }


    }
    else
    {
        //enables the bot
        //bouncers+
        //!enablebot
        if (data.message.toLowerCase().indexOf('!enablebot') > -1 
            && API.hasPermission(data.fromID, 2))
        {
            enable(false);
        }
    }

}

function newChatCommand(data)
{
	message = data.toLowerCase().split(' ');
	console.log(message);
    if (botEnabled)
    {
        //disable bot
        // /disable
        if (message[0] == "/disable")
        {
            disable(true);
        }

        //turn off canterlock checking
        // /canterlockoff
        if (message[0] == '/canterlockoff')
        {
            capslockOn = false;
            API.chatLog("Canterlock Disabled");
        }

        //turn on canterlock checking
        // /canterlockon
        if (message[0] == '/canterlockon')
        {
            capslockOn = true;
            API.chatLog("Canterlock Enabled");
        }

        //check if next song is in history
        // /nextsong
        if (message[0] == '/nextsong')
        {
            checkHistory();
        }

        //disable autojoin
        // /j
        if (message[0] == '/j')
        {
            if(autojoin){
                autojoin = false;
                API.chatLog("auto join disabled")
            }
            else
            {
                autojoin = true;
                API.chatLog("auto join enabled")

            }
        }

        //disable autowoot
        // /w
        if (message[0] == '/w')
        {
            if(autowoot){
                autowoot = false;
                API.chatLog("auto woot disabled")

            }
            else
            {
                autowoot = true;
                API.chatLog("auto woot enabled")

            }
        }

        //sends an @ message to all the mods
        //@mod || @mods
        if(message[0] == "@mods" || message[0] == "@mods")
        {
        	var staffList = API.getStaff()
        	var modString = "";
        	for(var i = 0; i < staffList.length; i++)
        	{
        		modString = modString + " @" + staffList[i].username);
        	}
        	API.chatLog(modString)
        }
    }

    //enable bot
    // /enable
    if (message[0] == '/enable')
    {
        enable(true);
    }
}

function userJoined(user){
    API.chatLog(user.username + " joined the room.");
}

function friendJoined(user) {
    API.chatLog("Your friend " + user.username + " just joined the room");
}

function fanJoined(user) {
    API.chatLog("Your fan " + user.username + " just joined the room");
}

function userLeft(user) {
    API.chatLog(user.username + " left the room");
}

function nextDJ(data){
    if(autowoot)
    {
        $("#woot").click();
    }
    if(autojoin)
    {
        if(data.lastPlay.dj.id == API.getUser().id)
        {
            API.djJoin();
        }
    }
    API.chatLog(data.dj.username + " is playing "  + data.media.title + " by " + data.media.author);
    for(var i = 0; i < history.length; i++)
    {
        if(data.media.cid == history[i].media.cid)
        {
            API.chatLog("The current song is in history at place " + i + "!");
        }
    }
    checkHistory();
}

function voteUpdate(data){
	if(data.vote == -1){
		API.chatLog(data.user.username + " mehed.");
	}
}

function curateUpdate(data){
	var media = API.getMedia();
	API.chatLog(data.user.username + " curated " + media.author + " - " + media.title + ".");
}

API.chatLog("Botinator Loaded");

API.on(API.CHAT, newChat);

API.on(API.CHAT_COMMAND, newChatCommand);

API.on(API.USER_JOIN, userJoined);

API.on(API.FRIEND_JOIN, friendJoined);

API.on(API.FAN_JOIN, fanJoined);

API.on(API.USER_LEAVE, userLeft);

API.on(API.DJ_ADVANCE, nextDJ);

API.on(API.VOTE_UPDATE, voteUpdate);

API.on(API.CURATE_UPDATE, curateUpdate);