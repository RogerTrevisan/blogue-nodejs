const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')
const validaCategoria = require('../control/validaCategoria.js')
const validaPostagem = require('../control/validaPostagem')
const {eAdmin} = require('../helpers/eAdmin')

router.get('/', eAdmin, (req,res) => {
    res.render('admin/index')
})

router.get('/categorias', eAdmin, (req,res) => {
    Categoria.find().lean().sort({date:'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias:categorias})
    }).catch((err) => { 
        req.flash('error_msg','Erro ao listar a(s) categoria(s).'),
        res.redirect('../admin')
    })
})

router.get('/categorias/add',  eAdmin, (req,res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin, (req,res) => {
    var erros = validaCategoria(req.body)
        
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

router.get('/categorias/edit/:id', eAdmin,  (req,res) => {
    
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria:categoria})
    }).catch((err) =>  {
        req.flash('error_msg', 'Categotia não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit',  eAdmin, (req,res) => {    
    Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {
        var erros = validaCategoria(req.body)
        
        
        
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
    
    router.post('/categorias/deletar', eAdmin, (req,res) => {
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg','Categoria deletada com sucesso.')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg','Erro ao deletar categoria.')
            res.redirect('/admin/categorias')
            
        })
    })
    
    router.get('/postagens', eAdmin, (req,res) => {
        Postagem.find().populate('categoria').lean().sort({date:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch((err)=>{
        req.flash('error_msg','Erro ao listar a(s) postagens(s)')
        res.redirect('/admin/postagens')
    })
    
})

router.get('/postagens/add', eAdmin, (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Erro ao carregar o formulário')
    })
})

router.post('/postagens/nova', eAdmin, (req,res)=>{
  var erros = validaPostagem(req.body)  
    if (erros.length > 0 ) {
        Categoria.find().lean().then((categorias)=>{
            res.render('admin/addpostagem', {erros: erros, categorias: categorias})
        })
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg','Postagem criada com sucesso.')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', eAdmin, (req,res)=>{
    
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            let selectFilter = []
            categorias.forEach(cat => {
                if (cat._id.toString() !== postagem.categoria.toString()) {
                    selectFilter.push({
                        _id: cat._id,
                        nome: cat.nome,
                        selected: false
                    })
                } else {
                    selectFilter.push({
                        _id: cat._id,
                        nome: cat.nome,
                        selected: true
                    })
                }
            })
            res.render('admin/editpostagens', {categorias:categorias,postagem:postagem,selectFilter:selectFilter})
        }).catch((err)=>{
            req.flash('error_msg, Erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg, Erro ao carregar formulario de edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', eAdmin, (req,res)=>{
    Postagem.findOne({_id:req.body.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            var erros = validaPostagem(req.body)    
            
            if(erros.length > 0 ) {
                res.render('admin/editpostagens', {categorias:categorias,postagem:postagem,erros:erros})
            } else{
                Postagem.findOne({_id:req.body.id}).then((postagem)=>{
                   
                    postagem.titulo=req.body.titulo
                    postagem.slug=req.body.slug
                    postagem.descricao=req.body.descricao
                    postagem.conteudo=req.body.conteudo
                    postagem.categoria=req.body.categoria
                    postagem.date=Date.now()
                    
                    postagem.save().then(()=>{
                        req.flash('success_msg', 'Postagem editada com sucesso!')
                        res.redirect('/admin/postagens')
                    }).catch((err)=>{
                    req.flash('error_msg', `Erro interno ${err}`)
                    res.redirect('/admin/postagens')
                    })
                })
            }
        })
    })
})

router.post('/postagem/deletar', eAdmin, (req,res)=>{ 
    Postagem.findOneAndDelete({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Sucesso ao deletar a postagem.')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg', 'Falha ao deletar a postagem.')
        res.redirect('/admin/postagens')
    })
})

module.exports = router