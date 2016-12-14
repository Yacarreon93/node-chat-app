const expect = require('expect')

const {Users} = require('./users')

describe('Users', () => {
    var users
    beforeEach(() => {
        users = new Users()
        users.users = [{
            id: '1',
            name: 'Nile',
            room: 'Node'
        }, {
            id: '2',
            name: 'Luis',
            room: 'React'
        }, {
            id: '3',
            name: 'Arturo',
            room: 'Node'
        }]
    })
    it('Should add new user', () => {
        var users = new Users()
        var user = {
            id: 123,
            name: 'Yasser',
            room: 'College'
        }
        var resUser = users.addUser(user.id, user.name, user.room)
        expect(users.users).toEqual([user])
    })
    it('Should remove a user', () => {
        var userId = '1'
        var user = users.removeUser(userId)        
        expect(user.id).toBe(userId)
        expect(users.users.length).toBe(2)
    })
    it('Should not remove user', () => {
        var userId = '2'
        var user = users.getUser(userId)        
        expect(user).toNotExist()
        expect(users.users.length).toBe(3)
    })
    it('Should find a user', () => {
        var userId = '2'
        var user = users.getUser(userId)        
        expect(user.id).toBe(userId)
    })
    it('Should not find user', () => {
        var userId = '99'
        var user = users.getUser(userId)        
        expect(user).toNotExist()
    })
    it('Should return names for Node room', () => {
        var userList = users.getUserList('Node')
        expect(userList).toEqual(['Nile', 'Arturo'])
    })
    it('Should return names for React room', () => {
        var userList = users.getUserList('React')
        expect(userList).toEqual(['Luis'])
    })
})