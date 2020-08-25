const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  return res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res) => {
  return res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  });
});

server.listen(3002, () => console.log('Server started.'))