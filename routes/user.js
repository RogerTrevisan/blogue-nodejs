const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get('/cadastro', (req, res) => {
    res.render('user/cadastro')
})
router.post('/cadastro', (req, res) => {
    
})

module.exports = router