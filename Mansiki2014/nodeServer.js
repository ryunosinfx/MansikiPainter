

var net = require('net');
var tls = require('tls');
var http = require('http');
var WSServer = require('websocket').server;
var url = require('url');
var fs = require('fs');
var plainHttpServer = http.createServer(function(req, res) {
    var path = req.url;
    console.log(path+" /"+path.indexOf("?"));
    var mime ='text/html';
    if(path.indexOf(".css") > 0){
        mime = 'text/css';
    }else if(path.indexOf(".js") > 0){
        mime = 'text/javascript';
    }
    var length = path.indexOf("?")>=0 ? path.indexOf("?"):path.length;
    res.writeHead(200, { 'Content-Type': mime});
    if(path===null||path==="null"){
        return ;
    }
    try{
	res.end(fs.readFileSync("."+path.substring(0,length)));
    }catch(e){
	res.end("null");
    }
}).listen(80);
//callback for when secure connection established
function connected(stream) {
    if (stream) {
        // socket connected
        stream.write("GET / HTTP/1.0\n\rHost: encrypted.google.com:443\n\r\n\r");
    } else {
    	onsole.log("TLS Connection failed");
    }
}
var options ={host:"172.20.10.11",port:443};

var webSocketServer = new WSServer({httpServer: plainHttpServer});
var dummy = this;
console.log('webSocketServer 1');
webSocketServer.on('request', function (req) {
    req.origin = req.origin || '*';
    console.log('WS client requested');

    //送信
    dummy.socket = tls.connect(options.port,options.host,
        function() { //'connect' listener
        console.log('TLS client connected');
        dummy.connected = true;
        if (dummy.socket.authorized) {
            dummy.socket.setEncoding('utf-8');
            connected(dummy.socket);
        } else {
            console.log(dummy.socket.authorizationError);
            connected(null);
        }
    });
    var websocket = req.accept(null, req.origin);
    websocket.on('message', function(msg) {
        //送信
        if(dummy.socket){
            dummy.socket.write(msg);
        }
    });
    //受信
    dummy.socket.on('data', function(data) {
        console.log(data.toString());
        websocket.send(data.toString());
    });
    //エンド
    dummy.socket.on('close',  function(code,desc) {
        console.log('TLS client disconnected:' + code + ' - ' + desc);
        websocket.close();
        dummy.socket = null;
    });
    websocket.on('close', function (code,desc) {
        console.log('WS connection released! :' + code + ' - ' + desc);
        if(dummy.socket){
            dummy.socket.end();
        }
    });
    /** エラー受信 */
    dummy.socket.on('error', function(e){
        console.log('TLS Connection Failed - ' + options.host + ':' + options.port);
        console.error(e.message);
    });
    /** 終了 */
    dummy.socket.on('end', function(had_error){
        console.log('TLS Connetion End - ' + options.host + ':' + options.port);
    });
});
console.log('webSocketServer 2');
