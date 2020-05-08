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

    if (!slug || typeof slug == undefined || slug == null) {
        erros.push({texto: 'Slug inválido'})
    }

    if (slug.length < 3) {
        erros.push({
            texto: 'O nome do Slug é muito curto, nescessário ter ao menos 3 digitos.'
        })
    }

    if (/\s/g.test(slug) == true) {
        erros.push({
            texto: 'O slug não pode conter espaço vazio.'
        })
    }
    
    if (/[A-Z]/g.test(slug) == true) {
        erros.push({
            texto: 'O slug não pode conter letras maiúsculas.'
        })
    }
    
    if (/[0-9]/g.test(slug) == true) {
        erros.push({
            texto: 'O slug não pode conter numeros.'
        })
    }

    if (/[-_=+§~^´`:;/?.,><)(*&¬¨$#@!"'¹²³£¢|]/g.test(slug) == true) {
        erros.push({
            texto: 'O slug não pode conter caracteres especiais.'
        })
    }

    if (erros.length > 0 ) {
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.name,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg','Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg','Erro ao criar a categoria.')
            console.log('Erro ao adicionar nova tabela.')
        })
    }
})
router.get('/posts',(req,res) => {
    res.send('Página posts')    
})
module.exports = router