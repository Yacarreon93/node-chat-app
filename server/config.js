'user strict'

const config = {
    PORT: process.env.PORT || 3000,
    DB_HOST: 'localhost',
    DB_PORT: '27017',
    DB_NAME: 'chat-app',    
}

config.DB = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`

module.exports = config