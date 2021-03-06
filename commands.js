try {
    var Discord = require("discord.js");
}
catch (e) {
    console.log(e.stack);
    console.log(process.version);
    console.log("I think there is a complete lack of everything here... I mean, do you even want to start? There is no 'discord.js.'");
    process.exit();
}

try{
    var simpleGit = require('simple-git');
}
catch(e){
    console.log("You're missing 'simple-git' from your dependencies! Surely you want this bot to update, right?");
}

try{
    var exec = require('child_process').exec;
}
catch(e){
    console.log("Now now, if you don't have 'child_process', Yoshi won't be able to restart.");
}

try{
    var moment = require('moment');
}
catch(e){
    console.log("You must get 'moment' in a TIMEly manner... just get the module.");
}

try{
    var auth = require("./auth.json");
}
catch(e){
    console.log("You aren't getting very far without an 'auth.json'... just sayin'.");
}

try{
    var YouTube = require('youtube-node');
    var yt = new YouTube();

    yt.setKey(auth.yt);
    yt.addParam('type', 'video');
}
catch(e){
    console.log("There is no 'youtube-node' here... I guess you don't want YouTube videos.");
}

try {
    var request = require("request");
}
catch (e) {
    console.log("I'm REQUESTing you to get 'request.' I need it for pretty much everything.")
}

try {
    var cleverbot = require("cleverbot.io");
    var CleverBot = new cleverbot('qnZi4MTKo6zwwFkh','fM2qdIkZeGiC66ADn9ylCz9nZopCAfuN');
    CleverBot.setNick("Yoshi-Bot");
}
catch(e) {
    console.log("Oh, I see. You don't want to talk to me... you don't even have 'cleverbot.io'");
}
var qs = require("querystring");

exports.commands = {
    "mod": {
        description: "All commands useful for moderation and debugging of the bot.",
        help: "!help mod",
        commands: {
            "ping": {
                usage: "!ping",
                description: "I'll respond with a \"pong.\" Useful for checking if I'm alive.",
                process: function(bot, msg, params){
                    msg.channel.sendMessage("Pong!");
                }
            },

            "bye": {
                usage: "!bye",
                description: "Shuts down the bot.",
                process: function(bot, msg, params){
                    if (msg.author.id === "110932722322505728") {
                        msg.channel.sendMessage("Goodbye, everyone!").then(message => {
                            bot.destroy();
                        });
                    }
                    else {
                        msg.reply("I can't really take that order from you. Sorry. :c");
                    }
                }
            },

            "update": {
                usage: "!update",
                description: "Will check if there is a new updated available. If update is found, will attempt to restart with the new code.",
                process: function(bot, msg, params){
                    if (msg.author.id === "110932722322505728"){
                        if(bot.voiceConnection){
                            bot.voiceConnection.destroy();
                        }
                        msg.channel.sendMessage("Checking for updates...");
                        simpleGit().pull(function(error, update) {
                            if(update && update.summary.changes) {
                                msg.channel.sendMessage("Be right back!").then(message => {
                                    exec('node YoshiBot.js', (error, stdout, stderr) => {
                                        if (error) {
                                            console.error(`exec error: ${error}`);
                                            return;
                                        }
                                        console.log(`stdout: ${stdout}`);
                                        console.log(`stderr: ${stderr}`);
                                    });
                                    bot.destroy();
                                }).catch(console.log);
                            }
                            else{
                                msg.channel.sendMessage("Already up to date.");
                                console.log(error);
                            }
                        });
                    }
                    else{
                        msg.reply("I can't really take that order from you. Sorry. :c");
                    }
                }
            },

            "restart": {
                usage: "!restart",
                description: "Forces Yoshi-Bot to restart without needing to update.",
                process: function(bot, msg, params){
                    if (msg.author.id === "110932722322505728"){
                        if(bot.voiceConnection){
                            bot.voiceConnection.destroy();
                        }
                        msg.channel.sendMessage("Be right back!").then(message => {
                            exec('node YoshiBot.js', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                            });
                            bot.destroy();
                        }).catch(console.log);
                    }
                }
            },

            "clean": {
                usage: "<number of messages to delete> (Ex. !clean 5)",
                description: "Deletes the amount of given messages (as a number) in the channel.",
                process: function(bot, msg, params){
                    if (msg.member.hasPermission('MANAGE_MESSAGES')){
                        if(params){
                            if(!isNaN(params)){
                                msg.channel.fetchMessages({before: msg.id, limit: params}).then(messages => {
                                    msg.channel.bulkDelete(messages);
                                    msg.channel.sendMessage(params + " messages successfully deleted!");
                                }).catch(console.log);
                            }
                            else{
                                    msg.channel.sendMessage("That's not a number, silly.");
                            }
                        }
                        else{
                            msg.channel.sendMessage("I need to know how many messages to delete, buddy.");
                        }
                    }
                    else{
                        msg.reply("I can't really take that order from you. Sorry. :c");
                    }
                }
            }/*,

            "role": {
                usage: "<give or take> <user> <role name> (Ex. !role give @Ian#4208 Moderator)",
                description: "Gives or takes a role from a user, depending on specified action.",
                process: function(bot, msg, params){
                    if (msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')){
                        var options = params.split(" ");
                        if(options[0] == "give"){
                            var user = bot.fetchUser(options[1]);
                            if(user != null)
                        }
                        else if(options[0] == "take"){

                        }
                        else{
                            msg.channel.sendMessage("I don't know what " + options[0] + " is supposed to mean.");
                        }
                    }
                    else{
                        msg.reply("I can't really take that order from you. Sorry. :c");
                    }
                }
            }*/
        }
    },

    "images": {
        description: "All commands pertaining to image-hosting sites and image boards.",
        help: "!help images",
        commands: {
            "e621": {
                usage: "<tags> (Ex. !e621 canine, anthro, blue eyes)",
                description: "It returns an image (rating based on channel) from e621 based on tags (separated by a comma and a space) given.",
                process: function(bot, msg, params){
                    if (params.indexOf("murder") === -1 && params.indexOf("suicidal") === -1 && params.indexOf("suicide") === -1 && params.indexOf("dead") === -1 && params.indexOf("retard") === -1 && params.indexOf("gore") === -1 && params.indexOf("retarded") === -1 && params.indexOf("cancer") === -1 && params.indexOf("cancerous") === -1 && params.indexOf("scat") === -1 && params.indexOf("shit") === -1 && params.indexOf("crap") === -1 && params.indexOf("poo") === -1 && params.indexOf("pee") == -1 && params.indexOf("feces") === -1 && params.indexOf("urin") == -1 && params.indexOf("piss") == -1 && params.indexOf("diaper") == -1 && params.indexOf("baby") == -1 && params.indexOf("babies") == -1 && params.indexOf("defecation") === -1 && params.indexOf("child") === -1 && params.indexOf("kid") === -1 && params.indexOf("tod") === -1 && params.indexOf("toddler") === -1 && params.indexOf("cake_farts") == -1 && params.indexOf("diarrhea") == -1 && params.indexOf("soiled") == -1) {
                        var tagesto = "";
                        var tagestosplit = params.substring((params.indexOf(',') + 1), params.length).split(",");
                        if (params.indexOf(',') != -1) {
                            tagesto = (params.substring(0, params.indexOf(',')).replace(/\s/g, "_") + "+");
                            for (var i = 0; i < tagestosplit.length; i++) {
                                if (i === (tagestosplit.length - 1)) {
                                    tagestosplit[i] = tagestosplit[i].substring(1, tagestosplit[i].length).replace(/\s/g, "_");
                                    tagesto += tagestosplit[i];
                                }
                                else {
                                    tagestosplit[i] = tagestosplit[i].substring(1, tagestosplit[i].length).replace(/\s/g, "_");
                                    tagesto += tagestosplit[i] + "+";
                                }
                            }
                        }
                        else {
                            tagesto = params.replace(/\s/g, "_");
                        }

                        if (msg.channel.type === "dm" || msg.channel.name.indexOf("the_art_gallery") != -1 || msg.channel.name.indexOf("furry") != -1 || msg.channel.name.indexOf("2am") != -1 || msg.channel.name.indexOf("nsfw") != -1) {
                            console.log("Safe to post NSFW content.");
                        }
                        else {
                            tagesto += "+rating:safe";
                            if ((tagesto.indexOf("rating:explicit") != -1) || (tagesto.indexOf("penis") != -1) || (tagesto.indexOf("pussy") != -1) || (tagesto.indexOf("anus") != -1) || (tagesto.indexOf("dick") != -1) || tagesto.indexOf("rating:questionable") != -1 || tagesto.indexOf("genitalia") != -1 || tagesto.indexOf("genitals") != -1 || tagesto.indexOf("genital") != -1 || tagesto.indexOf("vagina") != -1 || tagesto.indexOf("cunt") != -1 || tagesto.indexOf("vaginal") != -1 || tagesto.indexOf("vaginal_penetration") != -1 || tagesto.indexOf("sex") != -1 || tagesto.indexOf("fuck") != -1 || tagesto.indexOf("intercourse") != -1 || tagesto.indexOf("cock") != -1) {
                                msg.channel.sendFile("C:/Users/Ian/Documents/GitHub/Yoshi-Bot/bruh.jpg", "bruh.jpg", "That content isn't appropiate for this channel. Go be naughty elsewhere.");
                                return;
                            }
                        }
                        var estoHeader = {
                            url: 'https://e621.net/post/index.json?tags=order:random+' + tagesto,
                            headers: {
                                'User-Agent': 'Yoshi-Bot/${process.version} (by NeoNinetales on e621)'
                            }
                        }

                        request(estoHeader,
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var estoThing = JSON.parse(body);
                                if (typeof (estoThing[0]) != "undefined") {
                                    msg.channel.sendMessage(estoThing[0].file_url.toString());
                                    msg.channel.sendMessage("https://e621.net/post/show/" + estoThing[0].id.toString());
                                }
                                else {
                                    msg.channel.sendMessage("No images found. Try different tags.")
                                }
                            }
                            else {
                                console.log(error);
                                msg.channel.sendMessage("The API isn't working and this is why I'm crashing.");
                                msg.channel.sendMessage(error);
                            }
                        });
                    }
                    else {
                        msg.channel.sendMessage("No. Stop it.");
                    }
                }
            },

            "mlfw": {
                usage: "<tags> (Ex. !mlfw twilight sparkle, happy)",
                description: "Returns a pony reaction image based on tags (separated by a comma and a space) given.",
                process: function(bot, msg, params){
                    var tagmlfw = "";
                    if (params.indexOf(',') != -1) {
                        tagmlfw = ("\"" + params.substring(0, params.indexOf(',')) + "\"" + ",");
                        var tagmlfwsplit = params.substring((params.indexOf(',') + 1),params.length).split(",");
                        for (var i = 0; i < tagmlfwsplit.length; i++) {
                            if (i === (tagmlfwsplit.length - 1)) {
                                tagmlfw += "\"" + tagmlfwsplit[i].substring(1, tagmlfwsplit[i].length) + "\"";
                            }
                            else {
                                tagmlfw += "\"" + tagmlfwsplit[i].substring(1, tagmlfwsplit[i].length) + "\","
                            }
                        }
                    }
                    else {
                        tagmlfw = "\"" + params + "\"";
                    }
                    request("http://mylittlefacewhen.com/api/v2/face/?search=[" + tagmlfw + "]&order_by=random&format=json",
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var mlfwThing = JSON.parse(body);
                            if (typeof (mlfwThing.objects[0]) != "undefined") {
                                msg.channel.sendMessage("http://mylittlefacewhen.com/" + mlfwThing.objects[0].image.toString());
                            }
                            else {
                                msg.channel.sendMessage("No images found. Try different tags.")
                            }
                        }
                        else {
                            console.log(error);
                            msg.channel.sendMessage(error);
                        }
                    });
                }
            },

            "subr": {
                usage: "<subreddit name> (Ex. !subr wheredidthesodago)",
                description: "Will return a random post from the user given subreddit using reddit's own \"random.\"",
                process: function(bot, msg, params){
                    request("https://www.reddit.com/r/" + params + "/random/.json", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var srThing = JSON.parse(body);
                            if(typeof (srThing.data) !== "undefined"){
                                msg.channel.sendMessage("I don't believe that's a subreddit. ~~Either that or it's banned, you sicko.~~");
                            }
                            else {
                                if (typeof(srThing[0].data.children[0].data.url) !== "undefined") {
                                    msg.channel.sendMessage(srThing[0].data.children[0].data.url);
                                }
                            }
                        }
                        else {
                            console.log(error);
                            msg.channel.sendMessage("I don't believe that's a subreddit. ~~Either that or it's banned, you sicko.~~");
                        }
                    });
                }
            },

            "woof": {
                usage: "!woof",
                description: "Returns a random woof image.",
                process: function(bot, msg, params){
                    request("http://random.dog/", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (typeof (body) != "undefined") {
                                woofThing = body.substring(50);
                                woofThing = woofThing.substring(0, woofThing.indexOf("'"));
                                msg.channel.sendMessage("http://random.dog/" + woofThing);
                            }
                            else {
                                msg.channel.sendMessage("Things are going wrong all over.");
                            }
                        }
                    });
                }
            },

            "meow": {
                usage: "!meow",
                description: "Returns a random meow image.",
                process: function(bot, msg, params){
                    request("http://random.cat/meow", function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var meowThing = JSON.parse(body);
                            if (typeof (meowThing.file) != "undefined") {
                                msg.channel.sendMessage(meowThing.file);
                            }
                            else {
                                msg.channel.sendMessage("Things are going wrong all over.");
                            }
                        }
                    });
                }
            }
        }
    },

    "fun": {
        description: "All miscellaneous, recreational commands.",
        help: "!help fun",
        commands: {
            "servers": {
                usage: "!servers",
                description: "List of servers I am in.",
                process: function(bot, msg, params){
                    msg.channel.sendMessage("I am currently serving in " + bot.guilds);
                }
            },

            "avie": {
                usage: "[Optional] <name or name portion> (Ex. '!avie Ian' or '!avie')",
                description: "Returns the avatar image of the specified user. If no user is specified, returns the avatar image of the author.",
                process: function(bot, msg, params){
                    if (params) {
                        if (bot.users.find("username", params) != null) {
                            msg.channel.sendMessage("https://discordapp.com/api/users/" + bot.users.find("username", params).id + "/avatars/" + bot.users.find("username", params).avatar + ".jpg");
                        }
                        else {
                            var regst = /^[^\s]+/;
                            var regend = /[^\s]+$/;
                            var match = true;
                            var users = bot.users.array();
                            for (var i = 0; i < users.length ; i++) {
                                if (regst.exec(users[i].username)[0] === params) {
                                    match = true;
                                    msg.channel.sendMessage("https://discordapp.com/api/users/" + users[i].id + "/avatars/" + users[i].avatar + ".jpg");
                                    return;
                                }
                                else if (regend.exec(users[i].username)[0] === params) {
                                    match = true;
                                    msg.channel.sendMessage("https://discordapp.com/api/users/" + users[i].id + "/avatars/" + users[i].avatar + ".jpg");
                                    return;
                                }
                                else {
                                    match = false;
                                }
                            }
                            if (match === false) {
                                msg.channel.sendMessage("I couldn't find the user you requested.");
                            }
                        }
                    }
                    else {
                        msg.channel.sendMessage(msg.author.avatarURL);
                    }
                }
            },

            "pick": {
                usage: "<options to pick from> (Ex. !pick option1, option2, option3)",
                description: "Will randomly pick from the number of options given by the user, separated by commas and spaces.",
                process: function(bot, msg, params){
                    var options = params.split(",");
                    var randomChoice = Math.floor(Math.random() * options.length);
                    options[0] = " " + options[0];

                    msg.channel.sendMessage("You must go with" + options[randomChoice] + ", " + msg.author + ".");
                }
            },

            "kms": {
                usage: "!kms",
                description: "You asked for death.",
                process: function(bot, msg, params){
                    msg.channel.sendTTSMessage("You're dead, kiddo. ᕕ[•̀͜ʖ•́]︻̷┻̿═━一 ---");
                }
            },

            "info": {
                usage: "[Optional] <name or name portion> (Ex. '!info Ian' or '!info')",
                description: "Will give information about the requested user and the server the command was issued in. If no user is specified, returns information about the author.",
                process: function(bot, msg, params){
                    var infoString = "";
                    var user = null;
                    if (params) {
                        if (bot.users.find("username", params) != null) {
                            user = bot.users.find("username", params);
                        }
                        else{
                            var regst = /^[^\s]+/;
                            var regend = /[^\s]+$/;
                            var match = true;
                            var users = bot.users.array();
                            for (var i = 0; i < users.length ; i++) {
                                if (regst.exec(users[i].username)[0] === params) {
                                    match = true;
                                    user = users[i];
                                }
                                else if (regend.exec(users[i].username)[0] === params) {
                                    match = true;
                                    user = users[i];
                                }
                                else {
                                    match = false;
                                }
                            }
                            if (match === false) {
                                msg.channel.sendMessage("I couldn't find the user you requested.");
                                return;
                            }
                        }
                    }
                    else{
                        user = msg.author;
                    }

                    infoString = "Information for user **" + user.username + "#" + user.discriminator + "** and **" + msg.guild.name + "**:";
                    msg.channel.sendMessage(infoString).then(message => {
                        msg.channel.sendMessage("His/Her avatar is: " + user.avatarURL).then(message => {
                            msg.channel.sendMessage("The server's icon is: " + msg.guild.iconURL).then(message => {
                                infoString = "- **" + user.username + "'s** ID is **" + user.id + "**.\n- This account was created in **" + user.creationDate + "**.\n";

                                if(user.bot){
                                    infoString += "- This user is **an official bot** account as per Discord API.\n";
                                }
                                else{
                                    infoString += "- This user is **not an official bot** account as per Discord API.\n";
                                }

                                var userServerDetails = msg.guild.member(user);
                                var roles = userServerDetails.roles.array();
                                infoString += "- This user has the role(s) **" + roles + "** in this server.\n- **" + user.username + "'s** nickname is **" + userServerDetails.nickname + "** in this server.\n- **" + user.username + "#" + user.discriminator + "** joined this server in **";
                                var t = new Date(userServerDetails.joinDate);
                                infoString += t + "**.\n\n- The ID of server **" + msg.guild.name + "** is **" + msg.guild.id + "**.\n- There are **" + msg.guild.memberCount + "** users in this server.\n- **" + msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator + "** is the owner of **" + msg.guild.name + "**.\n- This server was created in **" + msg.guild.creationDate + "**.";
                                msg.channel.sendMessage(infoString);
                            });
                        });        
                    });
                }
            },

            "8ball": {
                usage: "<question> (Ex. !8ball Will Ian ever get a life?)",
                description: "Will briefly turn into the Magical 8 Ball and respond to whatever question you pose.",
                process: function(bot, msg, params){
                    if(params){
                        request('https://8ball.delegator.com/magic/JSON/' + params, function(error, response, body){
                            if (!error && response.statusCode == 200){
                                answer = JSON.parse(body);
                                botResponse = "*The Magical 8 Ball answers...*\n";
                                botResponse += "`Question:` **" + params + "**\n";
                                botResponse += "`Answer:` **" + answer.magic.answer + "**";
                                msg.channel.sendMessage(botResponse);
                            }
                            else{
                                msg.channel.sendMessage("Whoops, I couldn't turn into an 8 Ball: " + error);
                            }
                        });
                    }
                }
            },

            "chat": {
                usage: "<text> (Ex. !chat Hello, how are you?)",
                description: "Allows you to chat with Yoshi-Bot! Aren't you itching to talk to someone? Here's your chance.",
                process: function(bot, msg, params){
                    CleverBot.create(function (err, session) {
                     CleverBot.ask(params, function (err, response) {
                          msg.channel.sendMessage(msg.author + ": " + response);
                        });
                    });
                }
            }
        }
    },

    "media": {
        help: "!help media",
        description: "All commands pertaining to music streaming and videos.",
        commands: {
            "voice": {
                usage: "!voice",
                description: "Joins the voice channel the author of the command is in.",
                process: function(bot, msg, params){
                    if (!bot.internal.voiceConnection) {
                        if(msg.author.voiceChannel == null){
                            msg.channel.sendMessage("You have to be in a voice channel before I can join it.");
                        }
                        else{
                            msg.author.voiceChannel.join();
                            msg.channel.sendMessage("Voice channel joined.");
                        }
                    }
                    else {
                        var flag = 0;
                        for(connection = 0; connection < bot.voiceConnections.length; connection++){
                            if(msg.guild.id == bot.voiceConnections[connection].voiceChannel.server.id){
                                msg.channel.sendMessage("I'm already in a voice channel.");
                                flag = 1;
                            }
                        }
                        if(flag == 0){
                            msg.author.voiceChannel.join();
                            msg.channel.sendMessage("Voice channel joined.");
                        }
                    }
                }
            },

            "play": {
                usage: "<SoundCloud or Youtube link> (Ex. !play https://soundcloud.com/assertivef/silva-hound-hooves-up-high)",
                description: "Queues or plays (if nothing in queue) the requested song. Worthless command.",
                process: function(bot, msg, params){
                    msg.channel.sendMessage("This command is worthless as of now.");
                    /*if (msg.content.length > 5) {
                            if (bot.internal.voiceConnection) {
                                var songName = msg.content.substring(6, msg.content.length);
                                var connection = bot.internal.voiceConnection;
                                var filePath = "https://api.soundcloud.com/tracks/194566340/stream";
                                msg.channel.sendMessage("Playing that for you in a sec...");
                                connection.playRawStream(filePath, {volume: 0.3});
                            }
                        }
                        else {
                            msg.channel.sendMessage("I'm already in the voice channel. Give me something to play.");
                        }*/
                }
            },

            "yt": {
                usage: "<search terms> (Ex. !yt PFUDOR)",
                description: "Returns the first YouTube video in a search based on the input query.",
                process: function(bot, msg, params){
                     if(params){
                        yt.search(params, 1, function(error, result) {
                          if (error) {
                            console.log(error);
                          }
                          else {
                            msg.channel.sendMessage("https://www.youtube.com/watch?v=" + result.items[0].id.videoId);
                          }
                        });
                    }
                    else{
                        msg.channel.sendMessage("Give me some search terms to look for, silly.");
                    }
                }
            }
        }
    }
}