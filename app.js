//Carregando módulos
    const express = require('express')
    const app = express

//Conexão express
const PORTA = 8181
app.listen(PORTA,() => {
    console.log(`Servidor rodando na porta: ${PORTA}`)
})