//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
const usuarios = require('./routes/user')
const passport = require('passport')
require('./config/auth')(passport)

//Configurações
    //Sessões
    app.use(session({
        secret: 'segredO',
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    //Midleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })
    //Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //Handlebars
    const hbs = handlebars.create({
        defaultLayout: 'main',
        helpers:{
        }
    })
    app.engine('handlebars', hbs.engine)
    app.set('view engine','handlebars')
    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(('mongodb://localhost/blogapp'),{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('conectado ao mongo...')
    }).catch((err) => {
        console.log(`Erro ao conectar: ${err}`)
    })
    //Public
    app.use(express.static(path.join(__dirname,'public')))
//Rotas
    //Home
    app.get('/', (req,res)=>{
        Postagem.find().populate('categoria').lean().sort({date:'desc'}).then((postagens)=>{
            res.render('index', {postagens:postagens})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404')
        })
    })
    //erro 404
    app.get('/404',(req,res)=>{
        res.send('Erro 404!')
    })
    //Postagens
    app.get('/posts',(req, res)=>{
        res.render('posts')
    })
    //Postagem pelo slug
    app.get('/postagem/:slug', (req,res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if (postagem) {
                res.render('postagem/index',{postagem:postagem})                
            } else {
                req.flash('error-msg', 'Esta postagem não existe.')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error-msg', 'Houve um erro interno.')
            res.redirect('/')
        })
    })
    //Categorias
    app.get('/categorias', (req,res)=>{
        Categoria.find().lean().sort({date: 'desc'}).then((categorias)=>{
            res.render('categorias/index',{categorias:categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao listar as categoria')
            res.redirect('/')
        })
    })
    //Categoria pelo slug
    app.get('/categoria/:slug', (req,res)=>{
        Categoria.findOne({slug:req.params.slug}).lean().then((categoria)=>{
            if (categoria) {
                Postagem.find({categoria: categoria._id}).populate('categoria').lean().then((postagem)=>{
                    res.render('categorias/postagens', {postagem:postagem, categoria:categoria})
                })
            } else {
                req.flash('error_msg', 'Categoria não esxiste.')
                res.redirect('categorias/index')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria.')
            res.redirect('/')
        })
    })
    //Rotas
    app.use('/admin', admin)
    app.use('/user', usuarios)
//Conexão express
    const porta = 8181
    app.listen(porta,() => {
        console.log(`Servidor rodando na porta: ${porta}`)
        })