const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model Usuario
require('../models/Usuario')
const Usuario = mongoose.model("usuarios")

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario) {
                return done(null, false,{message: 'Email não cadastrado.'})
            }
            bcrypt.compare(password, usuario.password, (erro, check)=>{

                if (check) {
                    return done(null.usuario)
                } else {
                    return done(null.false, {message: 'Senha não existe'})
                }
            })
        }).catch((err)=>{
            req.flash('msg_error', 'Erro interno ao realizar o login.')
            res.redirect('/')
        })
    }))

    passport.serializeUser((usuario,done)=>{
        done(null, usuario._id)
    })

    passport.deserializeUser((_id,done)=>{
         Usuario.findById(_id,(err, usuario)=>{
            done(err,user)
         })
    })
}