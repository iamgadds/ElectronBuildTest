const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log('received:', message);
  });


  setInterval(() => {
    const data = JSON.stringify({ message: 'Hello from server', timestamp: new Date() });
    ws.send(data);
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server started on ws://localhost:8080');
