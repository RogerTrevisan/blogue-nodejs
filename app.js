//Carregando módulos
const express = require('express')
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
//Configurações
    //Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebars');
//Conexão express
const PORTA = 8181
app.listen(PORTA,() => {
    console.log(`Servidor rodando na porta: ${PORTA}`)
    })