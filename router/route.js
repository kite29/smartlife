var schedule=require('node-schedule');
var id=require('idgen');
var date=new Date(2017,2,16,13,15,0);

var url="mongodb://jatters:alwaysforward1.@ds058579.mlab.com:58579/jatapp";

var users={
    user:{

    }

};

var rule = new schedule.RecurrenceRule();
rule.second = 5;

module.exports=function(app,io,_db){

    var j=schedule.scheduleJob(rule, function(){
       // io.sockets.emit("notify",{"message":"welcome to smartlife"});
         io.to(users.user['8754623583']).emit("notify", {message:"welcome to smarlife"});
        console.log("SEND notification "+Date.now());

    });



    io.on("connection",function(socket){

        console.log("A user connected:"+socket.id+" "+date);
        socket.emit('message',{'id':socket.id});



        socket.on('register',function(data){
            var d=JSON.parse(data);
            console.log("registering user "+d.id);
            users.user[d.no]=d.id;
            console.log(users);
   //         io.sockets.emit("notify",{"message":"welcome to smartlife"});
        })



        socket.on('disconnect',function(){
            console.log('A user disconnected '+socket.id);

        })




        app.post("/house_signup",function(req,res){

            var house_id=id(8);
            house_id.toUpperCase();
               console.log("A house signed up");
             var data={
                 _id:req.body.phone,
             name:req.body.name,
                 email:req.body.email,
                 password:req.body.password,
                 no_of_members:req.body.no,
                 house_id:house_id
             }
var h=_db.collection('smart_users');
            h.insertOne(data,function(err){
                if(err) {
                    console.log("mongo error");
                res.send("unsuccess");
                }
                else {
                    console.log("Smart user registered succesfully");
                res.send("success");
                }
                });





        });





    })






}