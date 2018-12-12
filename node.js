var http = require("http");
var fs = require("fs");
var demo = http.createServer(function(request,response){
    var path = request.url;
        fs.readFile("index.html",function(err,data){
            response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
            response.write(data);
            response.end();
        });
    
}).listen("8080");
console.log("server start");