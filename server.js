const mongoose = require("mongoose");
const config = require('./config/config').get(process.env.NODE_ENV);
const app = require('./app');
const http = require('http');
const port = process.env.PORT || 4512;
app.set('port', port);

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

var server = http.createServer(app);




var io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log('sockect connection!!');
    let src = "holaa";


    socket.on('changeVideo', (data) => {
        console.log(data.src);
        let src = data.src;
        socket.broadcast.emit("VideoName", { src: data.src });

    });
    socket.emit('msg', { msg: src });

})

server.listen(port, () => {
    console.log("SERVER RUNNING");

});