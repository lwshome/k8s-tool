'use strict'
const fs = require("fs");
const k8s= require("./k8s")
const _config = global._config

const _express = require('express')
const app = _express();
const http = require('http').Server(app);
const https=require("https").createServer({
  key:fs.readFileSync('config/certs/server.key'),
  cert:fs.readFileSync('config/certs/server.crt')
},app);
console.log(_config)
http.listen(_config["http-port"], () => {
  console.log(`Socket.IO server running at http://localhost:${_config["http-port"]}/`);
});

https.listen(_config["https-port"], () => {
  console.log(`Socket.IO server running at https://localhost:${_config["https-port"]}/`);
})

app.use(_express.static('./public'));
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","GET");
  next();
});

exports.http=http;
exports.https=https;

const io = require('socket.io')(http);
const httpsIO = require('socket.io')(https)
io.on('connection', o=>{
  console.log("connect http")
  o.io=io
  socketFun(o,"http: ")
});

httpsIO.on('connection',  o=>{
  console.log("connect https: ")
  o.io=httpsIO
  socketFun(o,"https: ")
});

io.on('disconnect', o=>{
  _registerList.splice(_registerList.indexOf(o),1)
  console.log("disconnect")
})

function socketFun(socket){
  socket.on('work', msg => {
    // console.log(msg)
    let _fun=function(v){
      _sendMsg({
        k:msg.k,
        data:v
      })
    }

    k8s.k8s[msg.method](msg.data||_fun,_fun)
  });

  socket.on('disconnect', function() {
    console.log("disconnect")
  });

  function _sendMsg(m){
    socket.io.emit("work",m)
  }
}