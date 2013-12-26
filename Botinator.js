API.on(API.CHAT, newChat);
API.chatLog("Botinator Loaded");

API.on(API.CHAT_COMMAND, newChatCommand);

var botEnabled = true;

function newChat(data) {
    if (botEnabled) {
        if (data.message.indexOf('!source') > -1 || data.message.indexOf('!sourcecode') > -1) {
            API.sendChat("The sourcecode for Botinator, gbear605's bot, can be found at https://github.com/Gbear605/Botinator");
        }
        if (data.message.indexOf('!nextepisode') > -1 || data.message.indexOf('!nextep') > -1) {
            var nextepisodeJSON = $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/next\"&format=json");
            nextepisodeJSON.complete(function () {
                var nextepisodetimeJSON = $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select * from json where url=\"http://api.ponycountdown.com/until/next\"&format=json");
                var nextEpisodeName = nextepisodeJSON.responseJSON.query.results.json.name;
                nextepisodetimeJSON.complete(function () {
                    var nextepisodetime = nextepisodetimeJSON.responseJSON.query.results.json;
                    var nextEpisodeTimeDays = Math.round(((nextepisodetime / (1000 * 60 * 60 * 24))));
                    var nextEpisodeTimeHours = Math.round(((nextepisodetime / (1000 * 60 * 60)) % 24));
                    var nextEpisodeTimeMinutes = Math.round(((nextepisodetime / (1000 * 60)) % 60));
                    var nextEpisodeTimeSeconds = Math.round((nextepisodetime / 1000) % 60);
                    API.sendChat("The next episode is \"" + nextEpisodeName + "\" and it is in " + nextEpisodeTimeDays + " days, " + nextEpisodeTimeHours + " hours, " + nextEpisodeTimeMinutes + " minutes, and " + nextEpisodeTimeSeconds + " seconds.");
                });
            });
        }
        if (data.message.indexOf('!disablebot') > -1 && API.hasPermission(data.fromID, 2)) {
            botEnabled = false;
            API.sendChat("Botinator Disabled.");
        }
    }
    if (data.message.indexOf('!enablebot') > -1 && API.hasPermission(data.fromID, 2)) {
        botEnabled = true;
        API.sendChat("Botinator Enabled.");
    }

}

function newChatCommand(data) {
    console.log(data);
    if (botEnabled) {
        if (data.indexOf('disable') > -1) {
            botEnabled = false;
            API.chatLog("Botinator Disabled.");
        }
    }
    if (data.indexOf('enable') > -1) {
        botEnabled = true;
        API.chatLog("Botinator Enabled.");
    }

}