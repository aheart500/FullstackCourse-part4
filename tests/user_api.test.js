const app = require('../app')
const supertest = require('supertest')
const User = require('../models/User')
const mongoose = require('mongoose')
const api = supertest(app)

const initialUsers = [
    {
        name : 'Sayed',
        username: 'seka2020',
        password:'012521644'
    },
    {
        name : 'Aya',
        username : 'ayoya50',
        password : 'sanfoora10'
    }
]


beforeEach(async()=>{
    await User.deleteMany({})
    let newUser = new User(initialUsers[0])
    await newUser.save()
    newUser = new User(initialUsers[1])
    await newUser.save()
})

describe('Testing Users API',()=>{
    describe('Testing posting new users',()=>{
        test('Posting a user with complete info',async()=>{
            const sendUser = {
                name : 'Wael',
                username :'wael2000',
                password : 'we10we'
            }
            await api.post('/api/users').send(sendUser).expect(201).expect('Content-Type',/application\/json/)
            const updatedUsers = await User.find({})
            expect(updatedUsers.length).toBe(initialUsers.length+1)
        })
        test('Posting a user without password',async()=>{
            const sendUser = {
                name : 'Salaah',
                username :'Sesoo5',
            }
            await api.post('/api/users').send(sendUser).expect(400).expect('Content-Type',/application\/json/)
            const updatedUsers = await User.find({})
            expect(updatedUsers.length).toBe(initialUsers.length)
        })
        test('Posting a user with a short password',async()=>{
            const sendUser = {
                name : 'Salaah',
                username :'Sesoo5',
                password : '22'
            }
            await api.post('/api/users').send(sendUser).expect(400).expect('Content-Type',/application\/json/)
            const updatedUsers = await User.find({})
            expect(updatedUsers.length).toBe(initialUsers.length)
        })
    })
})

afterAll(()=>{
    mongoose.connection.close()
})