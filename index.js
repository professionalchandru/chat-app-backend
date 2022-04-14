const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

// Import server from socket.io
const {Server} = require('socket.io');

app.use(cors());
const server = http.createServer(app);


// Initialize IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) =>{
    console.log("User Connected ", socket.id);


    // To join spcific room by room id
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User connected with id ${socket.id} in the room ${room}`)
    })

    // Capture the message from one user and send back to frontend
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
        console.log("data", data)
    })

    // Disconnect user from room
    socket.on('disconnect', () => {
        console.log("user disconnected ", socket.id)
    })
})

app.get('/', (req, res) => {
    res.send("Backend Working")
})

server.listen(3001, () => { console.log("server running on port 3001")})