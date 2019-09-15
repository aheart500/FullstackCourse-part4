const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog =require('../models/Blog')

const api = supertest(app)

const initialBlogs = [
    {
        _id : '5d7d2c449cd1e71f408a2a69',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    }
]

beforeEach(async ()=>{
    await Blog.deleteMany({})
    let newBlog = new Blog(initialBlogs[0])
    await newBlog.save()
    newBlog = new Blog(initialBlogs[1])
    await newBlog.save()
})
describe('Testing the Blog API ',()=>{
    describe('Testing Getting Blogs : ', ()=>{
        test('Blogs are json and they are of the right length ',async ()=>{
            const blogs = await api.get('/api/blogs').expect(200).expect('Content-Type',/application\/json/)
            expect(blogs.body.length).toBe(initialBlogs.length)
        })
        test('Blogs are defined by Id',async()=>{
            const blogs = await api.get('/api/blogs')
            expect(blogs.body[0].id).toBeDefined()
        })    
    })
    
    describe('Making post requests to blogs : ',()=>{
        test('Posting a new blog works well',async()=>{
            const newBlog = {
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12
            }
            await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type',/application\/json/)
            const blogsAtDb = await Blog.find({})
            expect(blogsAtDb.length).toBe(initialBlogs.length + 1)
        })
        
        test('Posting a blog without likes sets the likes to be zero',async()=>{
            const newBlog = {
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            }
            await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type',/application\/json/)
            const savedBlog = await Blog.find({ title : 'First class tests'})
            expect(savedBlog[0].likes).toBe(0)
        })
        
        test('Posting a blog without a title or a url will sent 400 bad request',async()=>{
            const newBlog = {
                author: 'Robert C. Martin',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            }
            await api.post('/api/blogs').send(newBlog).expect(400)
            const blogs = await Blog.find({})
            expect(blogs.length).toBe(initialBlogs.length)
        })
    })
    test('Updating a blog',async()=>{
        const updatedBlog = {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 10,
        }
        await api.put('/api/blogs/5d7d2c449cd1e71f408a2a69').send(updatedBlog).expect(200).expect('Content-Type',/application\/json/)
        const newBlog = await Blog.find({title : 'React patterns'})
        expect(newBlog[0].likes).toBe(10)
    })
    test('Deleting a blog',async()=>{
        await api.delete('/api/blogs/5d7d2c449cd1e71f408a2a69').expect(204)
        const blogs = await Blog.find({})
        expect(blogs.length).toBe(initialBlogs.length-1)
    })
})



afterAll(()=>{
    mongoose.connection.close()
})