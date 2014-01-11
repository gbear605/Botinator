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
    if(nextSongInHistory == false)
    {
        API.chatLog("Next song not in history")
    }
}

function newChat(data)
{
    if (botEnabled)
    {
        //Tells the source code for the bot
        //!source || !sourcecode
        if (data.message.toLowerCase().indexOf('!source') > -1 
            || data.message.toLowerCase().indexOf('!sourcecode') > -1)
        {
            var sourceCodeSite = "https://github.com/Gbear605/Botinator";
            API.sendChat("The sourcecode for Botinator, gbear605's bot, can be found at " + sourceCodeSite);
        }

        //Tells the next my little pony episode using Yahoo APIs and PonyCountdown APIs
        //!nextepisode || !nextep || !next
        if (data.message.toLowerCase().indexOf('!nextepisode') > -1 
            || data.message.toLowerCase().indexOf('!nextep') > -1 
            || data.message.toLowerCase().indexOf('!next') > -1)
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

        //disables the bot
        //bouncers+
        //!disable
        if (data.message.toLowerCase().indexOf('!disable') > -1 
            && API.hasPermission(data.fromID, 1))
        {
            disable(false);
        }

        //says the bot's status
        //!status
        if (data.message.toLowerCase().indexOf('!status') > -1 )
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
	message = data.toLowerCase.split(' ');
    if (botEnabled)
    {
        //disable bot
        // /disable
        if (message[0] = "disable")
        {
            disable(true);
        }

        //turn off canterlock checking
        // /canterlockoff
        if (message[0] = 'canterlockoff')
        {
            capslockOn = false;
            API.chatLog("Canterlock Disabled");
        }

        //turn on canterlock checking
        // /canterlockon
        if (message[0] = 'canterlockon')
        {
            capslockOn = true;
            API.chatLog("Canterlock Enabled");
        }

        //check if next song is in history
        // /nextsong
        if (message[0] = 'nextsong')
        {
            checkHistory();
        }

        //disable autojoin
        // /j
        if (message[0] = 'j')
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
        if (message[0] = 'w')
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
    }

    //enable bot
    // /enable
    if (message[0] = 'enable')
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
    checkHistory();
}

API.chatLog("Botinator Loaded");

API.on(API.CHAT, newChat);

API.on(API.CHAT_COMMAND, newChatCommand);

API.on(API.USER_JOIN, userJoined);

API.on(API.FRIEND_JOIN, friendJoined);

API.on(API.FAN_JOIN, fanJoined);

API.on(API.USER_LEAVE, userLeft);

API.on(API.DJ_ADVANCE, nextDJ);