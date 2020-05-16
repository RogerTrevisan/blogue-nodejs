let validaCategoria = function validarCategoria(dados) {
    var erros = []
        
    if (!dados.name || typeof dados.name == undefined || dados.name == null) {
        erros.push({texto: 'Preencha o campo nome.'})
    }
    
    if (!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        erros.push({texto: 'Preencha campo slug. '})
    }

    if (dados.slug.length < 3) {
        erros.push({
            texto: 'O nome do Slug é muito curto, nescessário ter ao menos 3 digitos.'
        })
    }

    if (/\s/g.test(dados.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter espaço vazio.'
        })
    }
    
    if (/[A-Z]/g.test(dados.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter letras maiúsculas.'
        })
    }
    
    if (/[0-9]/g.test(dados.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter numeros.'
        })
    }
    
    if (/[-_=+§~^´`:;/?.,><)(*&¬¨$#@!"'¹²³£¢|]/g.test(dados.slug) == true) {
        erros.push({
            texto: 'O slug não pode conter caracteres especiais.'
        })
    }
   return erros
}
module.exports = validaCategoria