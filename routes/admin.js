const express = require('express')
const router = express.Router()

router.get('/',(req,res) => {
    res.render('admin/index')
})
router.get('/posts',(req,res) => {
    res.send('Página posts')    
})
router.get('/categorias',(req,res) => {
    res.send('Página categorias')
})
module.exports = router