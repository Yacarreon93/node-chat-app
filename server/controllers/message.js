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

function update(id, text) {

    return new Promise((resolve, reject) => {

        Message.findById(id, (err, message) => {

            if (err || !message) {
                reject(err)
            }

            message.text = text
            message.viewed = false

            message.save((err, messageUpdated) => {
                if (err) {
                    reject(err)
                }
                resolve(messageUpdated)
            })

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

function viewAll(name, room) {
    
    return new Promise((resolve, reject) => {

        Message.update({ room: room, from: { $ne: name } }, {viewed: true}, { multi: true } ,(err, messages) => {

            if (err || !messages) {
                reject(err)
            }      

            resolve(messages)

        })

    })

}

module.exports = { 
    create, 
    getAll,
    remove,
    update,
    viewAll
}