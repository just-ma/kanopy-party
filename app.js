const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server });

let clients = {};
let isFirst = true;

wss.on("connection", function (ws) {
  const id = isFirst ? 0 : 1;
  isFirst = !isFirst;
  clients[id] = ws;
  console.log("started client interval", id);

  ws.on("message", function () {
    console.log("got message");
    clients[id ? 0 : 1].send("bump");
  });

  ws.on("close", function () {
    console.log("stopping client interval", id);
    isFirst = !id;
  });
});

server.listen(process.env.PORT || 3000, () => console.log("running on 3000"));

module.exports = app;
