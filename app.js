//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const app = express
//Configurações
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebars');
//Conexão express
const PORTA = 8181
app.listen(PORTA,() => {
    console.log(`Servidor rodando na porta: ${PORTA}`)
