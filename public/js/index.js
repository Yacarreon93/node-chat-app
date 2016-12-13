var socket = io()
socket.on('connect', () => {
    console.log('Connected to server')
})
socket.on('disconnect', () => {
    console.log('Disconnected from server')
})
socket.on('newMessage', (message) => {
    console.log('New message', message)
    var li = $('<li></li>')
    li.text(`${message.from}: ${message.text}`)
    $('#messages').append(li)
})
// socket.emit('createMessage', {
//    from: 'Yasser',
//    text: 'Hi'
// }, (data) => {
//    console.log('Got it', data)
// })
$('#message-form').on('submit', (e) => {    
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, () => {
        console.log('Got it')
    })
})