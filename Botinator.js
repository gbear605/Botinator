API.on(API.CHAT, newChat);
API.chatLog("Botinator Loaded");

API.on(API.CHAT_COMMAND, newChatCommand);

var botEnabled = true;

var canterlockusers = {};

function newChat(data)
{
    if (botEnabled)
    {
        //Tells the source code for the bot
        //!source || !sourcecode
        if (data.message.toLowerCase().indexOf('!source') > -1 || data.message.toLowerCase().indexOf('!sourcecode') > -1)
        {
            API.sendChat(
                "The sourcecode for Botinator, gbear605's bot, can be found at https://github.com/Gbear605/Botinator"
            );
        }

        //Tells the next my little pony episode using Yahoo APIs and PonyCountdown APIs
        //!nextepisode || !nextep
        if (data.message.toLowerCase().indexOf('!nextepisode') > -1 || data.message.toLowerCase().indexOf('!nextep') > -1)
        {
            var nextepisodeJSON = $.getJSON(
                "http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/next\"&format=json"
            );
            //waits for the JSON to load, then does stuff in curly braces
            nextepisodeJSON.complete(function ()
            {
                var nextepisodetimeJSON = $.getJSON(
                    "http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/until/next\"&format=json"
                );
                var nextEpisodeName = nextepisodeJSON.responseJSON.query.results
                    .json.name;
                //waits for the JSON to load, then does stuff in curly braces
                nextepisodetimeJSON.complete(function ()
                {
                    var nextepisodetime = nextepisodetimeJSON.responseJSON
                        .query.results.json;
                    var nextEpisodeTimeDays = Math.round(((
                        nextepisodetime / (1000 * 60 * 60 * 24)
                    )));
                    var nextEpisodeTimeHours = Math.round(((
                            nextepisodetime / (1000 * 60 * 60)) %
                        24));
                    var nextEpisodeTimeMinutes = Math.round(((
                        nextepisodetime / (1000 * 60)) % 60));
                    var nextEpisodeTimeSeconds = Math.round((
                        nextepisodetime / 1000) % 60);
                    API.sendChat("The next episode is \"" +
                        nextEpisodeName + "\" and it is in " +
                        nextEpisodeTimeDays + " days, " +
                        nextEpisodeTimeHours + " hours, " +
                        nextEpisodeTimeMinutes + " minutes, and " +
                        nextEpisodeTimeSeconds + " seconds.");
                });
            });
        }

        //Anti canterlock bot stuff
        if(data.message.toUpperCase() == data.message && data.message.length > 5)
        {
            var userfrom = data.from;
            console.log(canterlockusers);
            if(userfrom in canterlockusers){
                console.log("canterlock used");
                canterlockusers[userfrom]++;
                console.log(userfrom + " has used canterlock " + canterlockusers[userfrom] + " times.");
            }
            else{
                canterlockusers[userfrom] = 1;
                console.log(data.from + " is using canterlock for the first time.");
            }
            if(canterlockusers[userfrom] % 2 == 1){
                API.sendChat("!rule 8 @" + userfrom + " has used canterlock " + canterlockusers[userfrom] + " times.");
            }
        }

        //disables the bot
        //bouncers+
        //!disablebot
        if (data.message.toLowerCase().indexOf('!disablebot') > -1 && API.hasPermission(data.fromID,
            2))
        {
            botEnabled = false;
            API.sendChat("Botinator Disabled.");
        }
        
    }
    else
    {
        //enables the bot
        //bouncers+
        //!enablebot
        if (data.message.toLowerCase().indexOf('!enablebot') > -1 && API.hasPermission(data.fromID,
            2))
        {
            botEnabled = true;
            API.sendChat("Botinator Enabled.");
        }
    }

}

function newChatCommand(data)
{
    console.log(data);
    if (botEnabled)
    {
        if (data.toLowerCase().indexOf('disable') > -1)
        {
            botEnabled = false;
            API.chatLog("Botinator Disabled.");
        }
    }
    if (data.toLowerCase().indexOf('enable') > -1)
    {
        botEnabled = true;
        API.chatLog("Botinator Enabled.");
    }

}