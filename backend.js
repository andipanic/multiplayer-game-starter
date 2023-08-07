const express = require('express')
const app = express()

// socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backEndPlayers = {}

const SPEED = 5

io.on('connection', (socket) => {
  console.log('a user connected');
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    sequenceNumber: 0
  }
  io.emit('updatePlayers', backEndPlayers)

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch (keycode) {
      case 'KeyW':
        console.log('Key w was pressed.')
        backEndPlayers[socket.id].y -= SPEED
        break

      case 'KeyA':
        console.log('Key A was pressed.')
        backEndPlayers[socket.id].x -= SPEED
        break

      case 'KeyS':
        console.log('Key S was pressed.')
        backEndPlayers[socket.id].y += SPEED
        break

      case 'KeyD':
        console.log('Key D was pressed.')
        backEndPlayers[socket.id].x += SPEED
        break
    }
  })

  console.log(backEndPlayers)
});

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})