var exports = module.exports = {};
var WebSocket = require('ws');
var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
ws.binaryType = 'arraybuffer'

exports.connect = function (type, targets) {
  ws.on('open', function open() {
    const uuid = guid();
    var msg = [{ticket: uuid}, {type: type, codes: targets}];
    ws.send(JSON.stringify(msg));
  });

  ws.on('message', function incoming(data) {
    console.log(String.fromCharCode.apply(null, new Uint8Array(data)));
  });
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
