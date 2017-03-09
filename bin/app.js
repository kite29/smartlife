var express=require('express');
var bodyparser=require('body-parser');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var m=require('mongodb');
var url="mongodb://@localhost:27017/socket";
var mc=m.MongoClient;
var _db;

mc.connect(url,function(err,db){
    _db=db;
});

function notify(req,res,next) {
    console.log("request been made"+req.url);
    next();
}
app.use(express.static(__dirname+'/html'));
app.use(notify);

require('../router/route.js')(app);



var users={user:{

}};
io.on('connection',function(socket){
    console.log('A user connected  '+socket.id);
    io.emit('message',{'id':socket.id});


socket.on('disconnect',function(){
    console.log('A user disconnected  '+socket.id);

});
    socket.on('connect_failed',function(){
        console.log("A user connection error"+socket.id);
    })

        socket.on('reconnect',function(){
        console.log("A user reconnect"+socket.id);
    })

    socket.on("register",function(data){
        var d=JSON.parse(data);
        console.log("register request "+d.id);
        var a=d.no;
        var b=d.id;
        users.user[a]=b;
console.log(users);


    });


    socket.on('message',function(data){

        console.log("A user message received"+socket.id+" "+data);

        var to=data.to;
        var from=data.from;
        var message=data.message;
        console.log(data);
        users.user['to'].emit("receive",{from:from,message:message});



    })
});




var server=http.listen(8000,function(){
    console.log("server running in port 8000");
});
