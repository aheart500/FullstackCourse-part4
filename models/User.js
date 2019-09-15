const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique : true
    },
    passwordHash : String,
    name : String,
    blogs : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON',{
    transform : (doc,ret) =>{
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
    }
})

module.exports = mongoose.model('User',userSchema)