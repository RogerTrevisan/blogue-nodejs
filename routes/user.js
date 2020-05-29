const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const validaCadastro = require('../control/validaCadastro')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/cadastro', (req, res) => {
    res.render('user/cadastro')
})
router.post('/cadastro', (req, res) => {
    var erros = validaCadastro(req.body)
    1
    if (erros.length > 0) {
        res.render('user/cadastro', {erros: erros})
    } else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Email já cadastrado.')
                res.redirect('/user/cadastro')
            } else {
             
                const novoUsuario = new Usuario({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro,salt) => {
                    bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
                        if (erro) {
                         req.flash('error_msg', 'Erro ao salvar o usuário.')
                         res.redirect('/')   
                        }
                        novoUsuario.password = hash
                        novoUsuario.save().then(()=>{
                            req.flash('success_msg', 'Usuário criado com sucesso.')
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash('error_msg', 'Erro ao criar o usuário')
                        })
                    })
                })

            }
        }).catch((err)=>{
            req.flash('msg_error','Erro interno ao criar o usuario')
            res.redirect('/')
        })
    }
})

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login', (req, res, next)=>{ 
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success_msg', 'Você saiu da sua conta com sucesso!')
    res.redirect('/')
})
module.exports = router