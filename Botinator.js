var botEnabled = true;

var canterlockUsers = {};
var capslockrepetition = 2;
var capslockOn = false;


function sourceCode()
{
    API.sendChat("The sourcecode for Botinator, gbear605's bot, can be found at https://github.com/Gbear605/Botinator");
}

function nextEpisode()
{
    var nextepisodeJSON = $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/next\"&format=json");
    //waits for the JSON to load, then does stuff in curly braces
    nextepisodeJSON.complete(function ()
    {
        var nextepisodetimeJSON = $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/until/next\"&format=json");
        var nextEpisodeName = nextepisodeJSON.responseJSON.query.results.json.name;
        //waits for the JSON to load, then does stuff in curly braces
        nextepisodetimeJSON.complete(function ()
        {
            var nextepisodetime = nextepisodetimeJSON.responseJSON.query.results.json;
            
            var nextEpisodeTimeSeconds = Math.round(nextepisodetime * 1000); 
            var nextEpisodeTimeMinutes = nextEpisodeTimeSeconds*60;
            var nextEpisodeTimeHours = nextEpisodeTimeMinutes*60;
            var nextEpisodeTimeDays = nextEpisodeTimeHours*24;

            API.sendChat("The next episode is \"" +
                nextEpisodeName + "\" and it is in " +
                nextEpisodeTimeDays + " days, " +
                nextEpisodeTimeHours + " hours, " +
                nextEpisodeTimeMinutes + " minutes, and " +
                nextEpisodeTimeSeconds + " seconds.");
        });
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
}

function disableCanterlock()
{
    capslockOn = false;
    API.chatLog("Canterlock Disabled");
}

function enableCanterlock()
{
    capslockOn = true;
    API.chatLog("Canterlock Enabled");
}

function newChat(data)
{
    if (botEnabled)
    {
        //Tells the source code for the bot
        //!source || !sourcecode
        if (data.message.toLowerCase().indexOf('!source') > -1 || data.message.toLowerCase().indexOf('!sourcecode') > -1)
        {
            sourceCode();
        }

        //Tells the next my little pony episode using Yahoo APIs and PonyCountdown APIs
        //!nextepisode || !nextep
        if (data.message.toLowerCase().indexOf('!nextepisode') > -1 || data.message.toLowerCase().indexOf('!nextep') > -1)
        {
            nextEpisode();
        }

        //Anti canterlock bot stuff
        if (data.message.toUpperCase() === data.message && data.message.length > 5 && capslockOn === true)
        {
            canterlock(data);
        }

        //disables the bot
        //bouncers+
        //!disablebot
        if (data.message.toLowerCase().indexOf('!disablebot') > -1 && API.hasPermission(data.fromID, 2))
        {
            disable(false);
        }

    }
    else
    {
        //enables the bot
        //bouncers+
        //!enablebot
        if (data.message.toLowerCase().indexOf('!enablebot') > -1 && API.hasPermission(data.fromID, 2))
        {
            enable(false);
        }
    }

}

function newChatCommand(data)
{
    if (botEnabled)
    {
        //disable bot
        // /disable
        if (data.toLowerCase().indexOf('disable') > -1)
        {
            disable(true);
        }

        //turn off canterlock checking
        // /canterlockoff
        if (data.toLowerCase().indexOf('canterlockoff') > -1)
        {
            disableCanterlock();
        }

        //turn on canterlock checking
        // /canterlockon
        if (data.toLowerCase().indexOf('canterlockon') > -1)
        {
            enableCanterlock();
        }
    }

    //enable bot
    // /enable
    if (data.toLowerCase().indexOf('enable') > -1)
    {
        enable(true);
    }
}


API.on(API.CHAT, newChat);
API.chatLog("Botinator Loaded");

API.on(API.CHAT_COMMAND, newChatCommand);