'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({

	from: String,
	text: String,
	createdAt: { type: Number, default: moment().valueOf() },
    room: String,
    viewed: Boolean

})

// Export Image schema as a model
module.exports = mongoose.model('Message', MessageSchema)