const fs = require('fs');
const ms = require('ms');
require('dotenv').config();

const { Client, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

var mineflayer = require('mineflayer');
const tpsPlugin = require('mineflayer-tps')(mineflayer);

const chatMessages = [
    '> Dùng lệnh ^help để xem các lệnh của bot',
    '> Fact: Sim rất uy tín :3',
    '> Đừng bao giờ tin vào người khác trong server này. SPY ĐÓ',
    '> lavacast là thứ không thể thiếu trong server không luật lệ'
  ];

const client = new Client({
	intents: [1, 32768, 512],
});

client.commands = new Collection();
const commandFolders = fs.readdirSync('./discord/commands');

for(const folder of commandFolders) 
{
    const folderFiles = fs.readdirSync(`./discord/commands/${folder}`).filter(file => file.endsWith('.js'));

    for(const file of folderFiles) 
    {
        const command = require(`./discord/commands/${folder}/${file}`);

        if(command.data instanceof SlashCommandBuilder) {
            client.commands.set(command.data.name, command);
        }
    }
}

// -------------------
//      BOT LOAD
// -------------------

client.once('ready', async () => {
    const commandData = client.commands.map(command => command.data.toJSON());
    await client.application.commands.set(commandData);
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`${commandData.length} registered commands.`);
});

// -------------------
//    BOT COMMANDS
// -------------------

client.on('interactionCreate', async interaction => 
{
    if(!interaction.isCommand()) return;
    if(!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;
    await command.execute(interaction).catch(console.error);
});

client.login(process.env.tokendiscord);


function createBot() {
    const bot = mineflayer.createBot({
      host: 'vinamc.net',
      port: 25565,
      username: "Sim_Bot",
      version: "1.16.5"
    });
    
    bot.on("windowOpen", function(window) {
        window.requiresConfirmation = false;
        setTimeout(() => { bot.clickWindow(13, 0, 0); }, ms(`5s`));
      })

    bot.on('messagestr', async (msg) => {
      console.log(msg)
      if (msg.trim() == '') return;
      if (msg.trim() == 'Hãy đăng ký tài khoản bằng lệnh : /register <mật khẩu bạn muốn đặt> <nhập lại mật khẩu') {
        bot.chat(`/register ${process.env.passmc} ${process.env.passmc}`)
      }

      if (msg.trim() == 'Hãy nhập lệnh : /login < mật khẩu của bạn> để vào server') {
        bot.chat(`/login ${process.env.passmc}`)
        setTimeout(() => {
            bot.setQuickBarSlot(0);
            bot.activateItem(false);
        }, 4000);
      }

      if (msg.trim() == 'Connecting to Anarchy...') {
        setInterval(() => {
            // Chọn ngẫu nhiên một câu chat từ mảng chatMessages
            const randomIndex = Math.floor(Math.random() * chatMessages.length);
            const randomMessage = chatMessages[randomIndex];
            bot.chat(`&b${randomMessage}`);
          }, 20000);
      }
      
    });
  
  bot.loadPlugin(tpsPlugin) // load plugin
  
  bot.once('login', () => {
    bot.once('spawn', () => {
        bot.swingArm("left");
        console.log("Da vao sanh cho...");
    });
  });
  
    var reconnect = 5;
    bot.on('end', (reason) => {
      console.log(`Disconected: ${reason}, kết nối lại sau ${reconnect}s`);
      setTimeout(() => {
        console.log("reconecting...");
        createBot();
      }, ms(`${reconnect}s`))
    });
  
    bot.on('chat', (username, message) => {
      const randomString = Math.random().toString(36).substring(2, 4);
      if (username === bot.username) return
      if (message === process.env.prefix + 'tps') {
        bot.chat(`&b tps của server hiện tại là : ${bot.getTps()}   << &aSim Shop >>`)
      }
      if (message === process.env.prefix + 'ping') {
        bot.chat(`&b ping của server là : ${bot.player.ping}ms  << &aSim Shop >> `);
      }
      if (message === process.env.prefix + 'help') {
        bot.chat(`&b các lệnh của bot: tps, ping, seed << &aSim Shop >> `)
      }
      if (message === process.env.prefix + 'seed') {
        bot.chat(`&b seed của server: -5831985412234010781 &a<< Sim Shop >> `)
      }
    })
    
  
  }

createBot();