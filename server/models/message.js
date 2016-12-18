'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const MessageSchema = Schema({

	from: String,
	text: String,
	createdAt: { type: Number, default: moment().valueOf() },
    room: String,
    viewed: { type: Boolean, default: false }

})

// Export Image schema as a model
module.exports = mongoose.model('Message', MessageSchema)