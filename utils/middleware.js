const morgan =require('morgan')

morgan.token('requestBody',(req,res)=>{
    return JSON.stringify(req.body)
})


const unknownEndpoint = (req,res) =>{
    res.status(404).send('<h1>Wrong url</h1>')
}
const getToken = (req,res,next) =>{
    
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        req.token = authorization.substring(7)
    }
    next()
}

const errorHandler = (error,req,res,next) =>{
    console.error(error.messsage)

    if (error.name === 'CastError' && error.kind === 'ObjectId'){
        return res.status(400).send({ error: 'malformatted id' })
    }else if (error.name ==='ValidationError'){
        return res.status(400).json({ error: error.message })
    }else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        })
    }

    next(error)

}

module.exports ={morgan,unknownEndpoint,errorHandler,getToken}