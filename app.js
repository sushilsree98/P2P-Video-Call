const express = require('express');
const app = express();
const path = require("path");
const config = require('dotenv').config()
const http = require('http')
const { v4:uuidv4 } = require('uuid')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const { ExpressPeerServer } = require('peer')
const peer = ExpressPeerServer(server,{
    debug: true
})

app.use('/peerjs', peer);
//View Engine

// Set 'views' directory for any views 
// being rendered res.render()
app.set("view engine", "ejs");
app.set('views', 'views');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'Public')));

 
// Calling the public folder
app.use(express.static("public"));
app.get('/' , (req,res)=>{
  res.send(uuidv4());
});
app.get('/:room' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room});
});
app.use((req, res, next)=>{
    console.log(process.env.LOCAL_PORT)
})

io.on('connection',(socket)=>{
    socket.on('newUser' , (id , room)=>{
        console.log(id, "room",room)
        socket.join(room);
        socket.to(room).emit('userJoined' , id);
        socket.on('disconnect' , ()=>{
            socket.to(room).emit('userDisconnect' , id);
        })
    })
})

server.listen(process.env.LOCAL_PORT,()=>{
    console.log("Server started")
})
