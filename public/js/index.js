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
socket.on('newLocationMessage', (message) => {
    console.log('New location message', message)
    var li = $('<li></li>')
    var a = $('<a target="_blank">My current location</a>')
    li.text(`${message.from}:`)
    a.attr('href', message.url)
    li.append(a)
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
var locationButton = $('#send-location')
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')        
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude            
        })
    }, () => {
        alert('Unable to fetch location')
    })
})