const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

app.use(express.static(path.join(__dirname, "/public")));

const wss = new WebSocket.Server({ server });

let clients = {};
let isFirst = true;

wss.on("connection", function (ws) {
  let id = isFirst ? 0 : 1;
  isFirst = !isFirst;
  clients[id] = ws;
  console.log("started client interval", id);

  ws.on("message", function incoming(data) {
    console.log("got message", data);
    clients[id ? 0 : 1].send("bump");
  });

  ws.on("close", function () {
    console.log("stopping client interval");
    isFirst = !id;
  });
});

server.listen(3000, () => console.log("running on 3000"));

module.exports = app;
