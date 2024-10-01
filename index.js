const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const prefix = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('명령어 파일들:', commandFiles); // 파일 목록 출력

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('name' in command && 'run' in command) {
    client.commands.set(command.name, command);
  } else {
    console.log(`[경고] ${filePath} 파일에 'name' 또는 'run' 프로퍼티가 없습니다.`);
  }
}
console.log(`${client.commands.size}개의 명령어가 로드되었습니다.`);

client.once('ready', () => {
  console.log(`${client.user.tag}로 로그인되었습니다!`);
});

client.on('messageCreate', message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.run(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('명령어를 실행하는 중 오류가 발생했습니다.');
  }
});

client.login(token).catch(err => {
  console.error('로그인 중 오류가 발생했습니다: ', err);
});
