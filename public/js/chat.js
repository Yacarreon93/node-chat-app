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

    socket.emit('join', params, (err, res) => {
        if (err) {
            alert(err)
            window.location.href = '/'
        } else {        
            console.log('Joined successfully')
            res.forEach((message) => newMessage(message))
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

socket.on('newMessage', (message) => newMessage(message))

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

function newMessage(message) {
    // console.log('New message', message)
    var formattedDate = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html()
    var html = Mustache.render(template, {
        _id: message._id,
        from: message.from,
        text: message.text,
        createdAt: formattedDate
    })
    $('#messages').append(html)
    scrollToBottom()
}

function deleteMessage(id) {
    socket.emit('deleteMessage', id)
}

socket.on('refreshMessages', (messages) => {
    $('ol#messages').empty()              
    messages.forEach((message) => newMessage(message))
})

socket.on('notify', (message) => {
    var template = $('#notification-template').html()
    var html = Mustache.render(template, {
        message
    })              
    $('#notification').append(html)  
    $('#notification').animate({
            height: '40px'
    }, 500, () => {            
        setTimeout(() => {
            $('#notification').animate({
                height: '0px'
            }, 500, () => {
                $('#notification').html('')
            })           
        }, 3000)
    })     
})