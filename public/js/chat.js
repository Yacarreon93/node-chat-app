var socket = io()
function scrollToBottom () {
    var messages = $('#messages')
    var newMessage = messages.children('li:last-child')    
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()
    // alert(clientHeight + '+' + scrollTop + '=' + scrollHeight)
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        // console.log('should scroll')
        messages.scrollTop(scrollHeight)
    }
}
socket.on('connect', () => {
    // console.log('Connected to server')
    var params = $.deparam(window.location.search)
    socket.emit('join', params, (error) => {
        if (error) {
            alert(error)
            window.location.href = '/'
        } else {
            console.log('Success')
        }
    })
})
socket.on('disconnect', () => {
    console.log('Disconnected from server')
})
socket.on('updateUserList', (users) => {
    console.log('Users list', users)
    var ol = $('<ol></ol')    
    users.forEach((user) => {
        ol.append($('<li></li>').text(user))
    })
    $('#users').html(ol)
}) 
socket.on('newMessage', (message) => {
    // console.log('New message', message)
    var formattedDate = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html()
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedDate
    })
    $('#messages').append(html)
    scrollToBottom()
    // var formattedDate = moment(message.createdAt).format('h:mm a')
    // var li = $('<li></li>')
    // li.text(`${message.from} (${formattedDate}): ${message.text}`)
    // $('#messages').append(li)
})
socket.on('newLocationMessage', (message) => {
    // console.log('New location message', message)
    var formattedDate = moment(message.createdAt).format('h:mm a')
    var template = $('#location-message-template').html()
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedDate
    })
    $('#messages').append(html)
    scrollToBottom()
    // var li = $('<li></li>')
    // var a = $('<a target="_blank">My current location</a>')
    // li.text(`${message.from}:`)
    // a.attr('href', message.url)
    // li.append(a)
    // $('#messages').append(li)
})
// socket.emit('createMessage', {
//    from: 'Yasser',
//    text: 'Hi'
// }, (data) => {
//    console.log('Got it', data)
// })
$('#message-form').on('submit', (e) => {    
    e.preventDefault()
    var messageTextBox = $('[name=message]')
    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, () => {
        messageTextBox.val('')
    })
})
var locationButton = $('#send-location')
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')        
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...')
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude            
        })
    }, () => {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location')
    })
})