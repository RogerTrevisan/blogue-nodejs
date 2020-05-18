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
//Configurações
    //Sessões
    app.use(session({
        secret: 'segredO',
        resave: true,
        saveUninitialized: true
    }))
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
    app.set('view engine','handlebars');
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
app.use('/admin', admin)
//Conexão express
const porta = 8181
app.listen(porta,() => {
    console.log(`Servidor rodando na porta: ${porta}`)
    })