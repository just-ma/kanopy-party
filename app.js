const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const PING_INTERVAL = 1200000; // 20 minutes
const HEARTBEAT = "ping";
const wss = new WebSocket.Server({ server });
let clients = new Map();

const generateId = () => {
  let id = Math.random().toString(36).substring(2);
  return clients.has(id) ? generateId() : id;
};

const broadcast = (message) => {
  for ([cid, cws] of Array.from(clients.entries())) {
    console.log(`[${cid}] SENT: ${message}`);
    cws.send(message);
  }
};

wss.on("connection", function (ws) {
  const id = generateId();
  clients.set(id, ws);
  console.log(`\n${id} started\n`);

  const heartbeat = () => {
    console.log(`---${id} sent hearbeat---`);
    ws.send(HEARTBEAT);
  };

  const interval = setInterval(heartbeat, PING_INTERVAL);

  ws.on("message", function (rec) {
    if (rec === HEARTBEAT) {
      console.log(`---${id} got hearbeat---`);
      return;
    }
    console.log(`[${id}] GOT: ${rec}`);
    broadcast(rec);
  });

  ws.on("close", function () {
    console.log(`\n${id} stopped\n`);
    clients.delete(id);
    clearInterval(interval);
  });
});

server.listen(process.env.PORT || 3000, () => console.log("running on 3000"));

module.exports = app;
