const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')

router.get('/',(req,res) => {
    res.render('admin/index')
})

router.get('/categorias',(req,res) => {
    Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias:categorias})
    }).catch((err) => { 
        req.flash('error_msg','Erro ao listar a(s) categoria(s).'),
        res.redirect('../admin')
    })
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

router.get('/categorias/edit/:id', (req,res) => {

    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria:categoria})
     }).catch((err) =>  {
         req.flash('error_msg', 'Categotia não existe')
         res.redirect('/admin/categorias')
     })
})

router.post('/categorias/edit', (req,res) => {    
    Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {
        var erros = []
        
        
    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({texto: 'Nome inválido'})
    }
    
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: 'Slug inválido'})
    }

    if (req.body.slug.length < 3) {
        erros.push({
            texto: 'O nome do Slug é muito curto, nescessário ter ao menos 3 digitos.'
        })
    }

    if (/\s/g.test(req.body.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter espaço vazio.'
        })
    }
    
    if (/[A-Z]/g.test(req.body.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter letras maiúsculas.'
        })
    }
    
    if (/[0-9]/g.test(req.body.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter numeros.'
        })
    }
    
    if (/[-_=+§~^´`:;/?.,><)(*&¬¨$#@!"'¹²³£¢|]/g.test(req.body.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter caracteres especiais.'
        })
    }
    
    if (erros.length > 0 ) {
        res.render('admin/editcategorias', {categoria:categoria, erros: erros})
    }else{
        Categoria.findOne({_id:req.body.id}).then((categoria) => {
        categoria.nome = req.body.name
        categoria.slug = req.body.slug
        
        categoria.save().then(() => {
            req.flash('success_msg','Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg','Erro ao salvar edição da categoria')
            res.redirect('/admin/editcategorias')            
        })
    }
        )}

    }).catch((err) => {
        req.flash('error_msg', 'Erro interno ao alterar a categoria.')
        res.redirect('/admin/categorias')

    })

})

router.post('/categorias/deletar',(req,res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg','Categoria deletada com sucesso.')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg','Erro ao deletar categoria.')
        res.redirect('/admin/categorias')

    })
})

router.get('/postagens',(req,res) => {
    Postagem.find().populate('categoria').sort({date:'desc'}).lean().then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch((err)=>{
        req.flash('error_msg','Erro ao listar a(s) postagens(s)')
        res.redirect('/admin/postagens')
    })

})

router.get('/postagens/add',(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Erro ao carregar o formulário')
    })
})

router.post('/postagens/nova',(req,res)=>{
    const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }
    new Postagem(novaPostagem).save().then(()=>{
        req.flash('success_msg','Postagem criada com sucesso.')
        res.redirect('/admin/postagens')
    })
})

router.get('/postagens/edit/:id',(req,res)=>{
    
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editpostagens', {categorias:categorias,postagem:postagem})
        }).catch((err)=>{
            req.flash('error_msg, Erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg, Erro ao carregar formulario de edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit',(req,res)=>{
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        postagem.titulo=req.body.titulo
        postagem.slug=req.body.slug
        postagem.descricao=req.body.descricao
        postagem.conteudo=req.body.conteudo
        postagem.categoria=req.body.categoria

        postagem.save().then(()=>{
          req.flash('success_msg', 'Postagem editada com sucesso!')
          res.redirect('/admin/postagens')
        }).catch((err)=>{
          req.flash('error_msg', 'Erro interno.')
          res.redirect('/admin/postagens')
        })
    })
})

router.post('/postagem/deletar',(req,res)=>{ 
    Postagem.findOneAndDelete({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Sucesso ao deletar a postagem.')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg', 'Falha ao deletar a postagem.')
        res.redirect('/admin/postagens')
    })
})

module.exports = router