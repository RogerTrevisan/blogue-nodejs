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
    }
})

mongoose.model('usuarios', Usuario)