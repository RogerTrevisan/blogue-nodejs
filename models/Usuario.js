const mongoose = require('mongoose')
const Schema = mongose.Schema

const Usuaro = new Schema ({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0
    }
})

mongoose.model('usuarios', Usuario)