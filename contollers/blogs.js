const blogsRouter =require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


blogsRouter.get('/',async(req,res,next)=>{
    try{
        const blogs = await Blog.find({}).populate('user',{name:1})
        res.json(blogs.map(blog => blog.toJSON() ))
    }catch(exception){
        next(exception)
    }
    
})

blogsRouter.post('/',async(req,res,next)=>{
    const token = req.token
    try{
        const decodedToken = jwt.verify(token,process.env.SECRET)
        if(!token || !decodedToken){
            return res.status(401).json({error : 'token missing or invalid'})
        }
        if(!req.body.title || !req.body.url){
            return res.status(400).end()
        }
        const user = await User.findById(decodedToken.id)
        const sentBlog = new Blog({
            title: req.body.title,
            author: req.body.author,
            url: req.body.url,
            likes: req.body.likes ? req.body.likes : 0,
            user : user._id
        })
    
        const saved = await sentBlog.save()
        user.blogs = user.blogs.concat(sentBlog._id)
        await user.save()
        res.status(201).json(saved.toJSON())
    }catch(exception){
        next(exception)
    }
})
blogsRouter.get('/:id',async (req,res)=>{
    const blogId = req.params.id
    try{
        const requestedBlog = await Blog.findById(blogId)
        res.json(requestedBlog.toJSON())
    }catch(exception){
        res.status(404).end()
    }
})
blogsRouter.delete('/:id',async(req,res,next)=>{
    try{
        const token = req.token
        const decodedToken = jwt.verify(token,process.env.SECRET)
        if(!token || !decodedToken){
            return res.status(401).json({error : 'token missing or invalid'})
        }
        const blog = await Blog.findById(req.params.id)
        if(decodedToken.id === blog.user.toString()){
            await Blog.findByIdAndRemove(req.params.id)
            return res.status(204).end()
        }else{
            res.status(401).json({error : 'You aren\'t authorized to delete this blog'})
        }
    }catch(error){
        next(error)
    }
    
})
blogsRouter.put('/:id',async(req,res,next)=>{
    const blogUpdate = req.body
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id,blogUpdate,{new : true})
        res.json(updatedBlog.toJSON())
    }catch(exception){
        next(exception)
    }
    
})

module.exports = blogsRouter