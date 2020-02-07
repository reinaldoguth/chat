const express = require('express')
const path = require('path')

const port = 3000
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
  res.render('index.html')
})

let messages = []

io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`)

  socket.emit('previousMessages', messages)

  socket.on('sendMessage', data => {
    //console.log('dados recebidos:', data)
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data)
  })
})

server.listen(port, (err) => {
  if (err) {
    console.log('Erro ao tentar inicializar o servidor de chat na porta ' + 
                  port)
  } else {
    console.log('Servidor de chat ativo na porta ' + port)
  }
})

