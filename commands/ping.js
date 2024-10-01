module.exports = {
  name: 'ping',  // 명령어 이름
  run(client, message, args) {  // 실행 함수
    message.reply('Pong!');  // 메시지 응답
  }
};
