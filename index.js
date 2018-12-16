const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/room/:name', (req, res) => {
    res.sendFile(__dirname + `/public/rooms/${req.params.name}.html`);
});

const devsRoom = io.of('/devs-room');

devsRoom.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        devsRoom.in(data.room).emit('message', `New user joined "${data.room}" room!`);
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.message}`);
        devsRoom.in(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        devsRoom.emit('message', 'user disconnected');
    })
})
