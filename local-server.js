const http = require('node:http');
const { handleRequest } = require('./server.js');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log('AI 工作台已启动： http://' + HOST + ':' + PORT);
});
