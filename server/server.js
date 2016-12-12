'use strict'

const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app) 
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('newMessage', {
        from: 'Yasser',
        text: 'This is a message.',
        createdAt: new Date()
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message)
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})

server.listen(port, () => {

    console.log(`Server listen on port ${port}`)

})