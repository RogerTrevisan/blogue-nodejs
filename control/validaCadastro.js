let validaCadastro = function validarCadastro(dados) {
    var erros = []
    
    if (!dados.name || typeof dados.name == undefined || dados.name == null) {
        erros.push({texto: 'Preencha o Nome.'})
    }

    if (!dados.email || typeof dados.email == undefined || dados.email == null) {
        erros.push({texto: 'Preencha o e-mail.'})
    }

    if (!dados.password || typeof dados.password == undefined || dados.password == null) {
        erros.push({texto: 'Preencha a senha.'})
    }

    if (!dados.password || typeof dados.password == undefined || dados.password == null) {
        erros.push({texto: 'Preencha o campo para cofirmar a senha.'})
    }

    if (dados.password != dados.confirmPassword) {
        erros.push({texto: 'As senhas não conferiram, tente novamente.'})
    }    
    if (dados.password.length < 6) {
        erros.push({texto: 'A senha precisa ter no minimo 6 caracteres.'})
    }

    return erros
}
module.exports = validaCadastro