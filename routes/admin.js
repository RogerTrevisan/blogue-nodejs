const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
router.get('/',(req,res) => {
    res.render('admin/index')
})
router.get('/categorias',(req,res) => {
    res.render('admin/categorias')
})
router.get('/categorias/add', (req,res) => {
    res.render('admin/addcategorias')
})
router.post('/categorias/nova',(req,res) => {
    var erros = []
    let name = req.body.name
    let slug = req.body.slug
    if (!name || typeof name == undefined || name == null) {
        erros.push({texto: 'Nome inválido'})
    }
    if (!slug || typeof slug == undefined || slug == null || cas) {
        erros.push({texto: 'Slug inválido'})
    }
    if (slug.length < 6) {
        erros.push({
            texto: 'Nome muito curto'
        })
    }
    if (erros.length > 0 ) {
        res.render('admin/addcategorias', {erros: erros})
    }
    const novaCategoria = {
        nome: req.body.name,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        console.log('Nova categoria adicionada com sucesso.')
    }).catch((err) => {
        console.log('Erro ao adicionar nova tabela.')
    })
})
router.get('/posts',(req,res) => {
    res.send('Página posts')    
})
module.exports = router