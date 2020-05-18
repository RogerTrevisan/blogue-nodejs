let validaPostagem = function validarPostagem(dados) {
    var erros = []
        
    if (!dados.titulo || typeof dados.titulo == undefined || dados.titulo == null) {
        erros.push({texto: 'Preencha o campo nome'})
    }
    
    if (!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        erros.push({texto: 'Preencha o campo slug'})
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

    if (!dados.descricao || typeof dados.descricao == undefined || dados.descricao == null ) {
        erros.push({
            texto: 'Preencha o campo de descrição'
        })
    }

    if (!dados.conteudo || typeof dados.conteudo == undefined || dados.conteudo == null ) {
        erros.push({
            texto: 'Preencha o campo de conteúdo'
        })
    }

    if (dados.categoria == '0') {
        erros.push({
            texto: 'É preciso selecionar uma categoria'
        })
    }

   return erros
}

module.exports = validaPostagem