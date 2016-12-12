var socket = io()
socket.on('connect', () => {
    console.log('Connected to server')
    socket.emit('createMessage', {
        from: 'Yasser',
        text: 'Hey, This is Yasser',
    })
})
socket.on('disconnect', () => {
    console.log('Disconnected from server')
})
socket.on('newMessage', (message) => {
    console.log('New message', message)
})