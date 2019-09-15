const loginRouter = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/',async(req,res)=>{
    const body = req.body
    const specifiedUser = await User.findOne({username : body.username})
    const correctPassword = specifiedUser === null ? false : await bcrypt.compare(body.password,specifiedUser.passwordHash)
    if(!(specifiedUser && correctPassword)){
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }
    const userForToken = {
        username : specifiedUser.username,
        id : specifiedUser._id
    }
    const token = jwt.sign(userForToken,process.env.SECRET)
    res.status(200).send({token,username : specifiedUser.username,name : specifiedUser.name})
})


module.exports = loginRouter