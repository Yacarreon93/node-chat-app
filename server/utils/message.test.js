'use strict'

var expect = require('expect')

var {generateMessage, generateLocationMessage} = require('./message')

describe('generalMessage', () => {
    it('Should generate correct message object', () => {
        var from = 'Yasser'
        var text = 'Some message'
        var message = generateMessage(from, text)
        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, text})
    })
})

describe('generateLocationMessage', () => {
    it('Should generate correct location message object', () => {
        var from = 'Admin'
        var latitude = 10
        var longitude = 12
        var url = 'https://www.google.com/maps?q=10,12'
        var message = generateLocationMessage(from, latitude, longitude)
        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, url})
    })
})