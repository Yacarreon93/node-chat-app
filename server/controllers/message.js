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

    return new Promise((resolve, reject) => {

        message.save((err, messageStored) => {
            if (err) {
                reject(err)
            }
            resolve(messageStored)
        })

    })

}

function remove(id) {

    return new Promise((resolve, reject) => {

        Message.findById(id, (err, message) => {
            if (err || !message) {
                reject(err)
            }
            message.remove((err) => {
                if (err) {
                    reject(err)
                }
                resolve(message)
            })
        })

    })

}

module.exports = { 
    create, 
    getAll,
    remove
}