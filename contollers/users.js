const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


usersRouter.get('/',async (req,res,next)=>{
    try{
        const savedUsers = await  User.find({}).populate('blogs',{title :1,url:1})
        res.json(savedUsers.map(user => user.toJSON()))
    }catch(exception){
        next(exception)
    }
})



usersRouter.post('/',async(req,res,next)=>{
    const sentUserData = req.body
    if(!sentUserData.username || !sentUserData.password ){
        return res.status(400).json({error: 'You must provide a username and a password'})
    }
    if(sentUserData.username.length < 3 || sentUserData.password.length < 3){
        return res.status(400).json({ error : 'The username and the password can\'t be less than three characters long'})
    }
    const passwordHash = await bcrypt.hash(sentUserData.password,10)

    const newUser = new User({
        name : sentUserData.name,
        username : sentUserData.username,
        passwordHash,
    })
    try{
        const saveNewUser = await newUser.save()
        res.status(201).json(saveNewUser.toJSON())
    }catch(exception){
        next(exception)
    }
    

})




module.exports = usersRouter