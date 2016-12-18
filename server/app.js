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
            messageController.create('Admin', 'Welcome to the chat room', params.room).then((result) => {
                socket.emit('newMessage', result)
            })            
            messageController.create('Admin', `${params.name} has joined`, params.room).then((result) => {
                socket.broadcast.to(params.room).emit('newMessage', result)
            })

        }, (error) => {

            callback(error)
            messageController.create('Admin', 'Welcome to the chat room', params.room).then((result) => {
                socket.emit('newMessage', result)
            })            
            messageController.create('Admin', `${params.name} has joined`, params.room).then((result) => {
                socket.broadcast.to(params.room).emit('newMessage', result)
            })
            
        })

        
})

    socket.on('createMessage', (message, callback) => {
        // console.log('createMessage', message)       
        var user = users.getUser(socket.id)
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        } 
        callback()
        // socket.broadcast.emit('newMessage', {
        //    from: message.from,
        //    text: message.text,
        //    createdAt: new Date().getTime()
        // })
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
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
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