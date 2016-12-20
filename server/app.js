'use strict'

const socketIO = require('socket.io')
const mongoose = require('mongoose')

var server = require('./server')
var config = require('./config')
var io = socketIO(server)

var {Users} = require('./utils/users')
var {isRealString} = require('./utils/validation.js')
var {generateMessage, generateLocationMessage} = require('./utils/message')
var messageController = require('./controllers/message')

var users = new Users()

io.on('connection', (socket) => {

    console.log('New user connected')

    socket.on('join', (params, callback) => {

        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Username and room name are required')
        }

        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)

        io.to(params.room).emit('updateUserList', users.getUserList(params.room))

        messageController.getAll(params.room).then((result) => { 
            callback(undefined, result)            
        })

        socket.emit('notify', 'Welcome to chat app')
        socket.broadcast.to(params.room).emit('notify', `${params.name} has joined`)

    })

    socket.on('createMessage', (message, callback) => {
            
        var user = users.getUser(socket.id)

        if (user && isRealString(message.text)) {

            messageController.create(user.name, message.text, user.room).then((res) => {
                io.to(user.room).emit('newMessage', res)
            })

        } 

        callback()

    })

    socket.on('updateMessage', (message, callback) => {
            
        var user = users.getUser(socket.id)

        if (user && isRealString(message.text)) {

            messageController.update(message.id, message.text).then((res) => {
                
                messageController.getAll(user.room).then((res) => { 

                    io.to(user.room).emit('refreshMessages', res)
                    callback()

                })

            })

        }        

    })

    socket.on('createLocationMessage', (coords) => {    
        var user = users.getUser(socket.id)    
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(
            user.name, 
            coords.latitude,
            coords.longitude
        ))
    })

    socket.on('disconnect', () => {
        // console.log('User was disconnected')
        var user = users.removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('notify', `${user.name} has left`)
        }
    })

    socket.on('deleteMessage', (id) => {

        messageController.remove(id).then((result) => {

            let user = users.getUser(socket.id)

            messageController.getAll(user.room).then((result) => { 

                io.to(user.room).emit('refreshMessages', result)

            })
            
        })

    })

})

mongoose.connect(config.DB, (err, res) => {

    if (err) {
        return console.log('ERROR: Unable to connect to database >', err)        
    }

    console.log('Connected to database successfully')
    
    server.listen(config.PORT, () => {
        console.log(`Server runs on http://localhost:${config.PORT}`)

    }) 

})