'user strict'

const express = require('express')
const http = require('http')
const path = require('path')

var publicPath = path.join(__dirname, '../public')

var app = express()
app.use(express.static(publicPath))

const server = http.createServer(app) 

module.exports = server