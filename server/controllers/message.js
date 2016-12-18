'use strict'

const Message = require('../models/message')

function getAll(room) {

    return new Promise((resolve, reject) => {

        Message.find({ 'room': room }, (err, messages) => {       
            if (err) {
                reject(err)
            }
            resolve(messages)
        })
        
    })

}

function create(from, text, room) {

    let message = new Message()
    message.from = from
    message.text = text
    message.room = room

    message.save((err, messageStored) => {
        if (err) {
            console.log(`Saving message ERROR: ${err}`)
        } 
    });

}

module.exports = { 
    create, 
    getAll 
}