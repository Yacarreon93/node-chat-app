'user strict'

const config = {
    PORT: process.env.PORT || 3000,
    DB_HOST: 'localhost',
    DB_PORT: '27017',
    DB_NAME: 'chat-app',    
}

config.DB = 'mongodb://app:app123@ds141088.mlab.com:41088/chat-app'

module.exports = config