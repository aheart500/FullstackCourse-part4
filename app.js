const express = require('express')
const cors = require('cors')
const bodyParser =require('body-parser')
const app = express()
const config = require('./utils/config')
const mongoose =require('mongoose')
const blogsRouter = require('./contollers/blogs')
const usersRouter = require('./contollers/users')
const loginRouter = require('./contollers/login')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true})
    .then(()=>{
        console.log('Connected to the Database')
    }).catch(error =>{
        console.log('Error in connection with the database',error.message)
    })


app.use(cors())
app.use(bodyParser.json())
app.use(middleware.morgan(':method :url :status :response-time ms :requestBody'))
app.use(middleware.getToken)

app.use('/api/blogs/',blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app