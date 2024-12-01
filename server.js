const express = require('express')
const path = require('path')
const socketIO = require('socket.io')

const http = require('http')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

server.listen(3000)

app.use(express.static(path.join(__dirname, 'public')))

let connecterUsers = []

io.on('connection', (socket)=> {
    console.log('Conexao detectada....')
    socket.on('join-request', (username)=> {
            socket.username = username
            connecterUsers.push(username)
            console.log(connecterUsers)

            socket.emit('user-ok', connecterUsers);
            socket.broadcast.emit('list-update', {
                joined: username,
                list : connecterUsers
            })

            socket.on('disconnect', ()=> {
                    connecterUsers = connecterUsers.filter(u => u != socket.username)
                    console.log(connecterUsers)

                    socket.broadcast.emit('list-update', {
                        left: socket.username,
                        list: connecterUsers
                    })
            })
    })

    socket.on('send-msg', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        }

        // socket.emit('show-msg', obj)
        socket.broadcast.emit('show-msg', obj)
    })


})