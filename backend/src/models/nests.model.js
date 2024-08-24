const {Types, Schema, model} = require('mongoose')

const NestSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: 'No description provided'
    },
    servers: {
        type: [Number],
       
    },
    eggs: {
        type: [Number],
        
    },
})

const Nest = model('Nest', NestSchema)
module.exports = Nest;