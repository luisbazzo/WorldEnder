const urlBase = 'https://worldender.vercel.app/api'
//const urlBase = 'http://localhost:4000/api'
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))
const access_token = localStorage.getItem("token") || null


//evento submit do formulário
document.getElementById('formNoticia').addEventListener('submit', function (event) {
    event.preventDefault() // evita o recarregamento
    const idNoticia = document.getElementById('id').value
    let noticia = {}

    if (idNoticia.length > 0) { //Se possuir o ID, enviamos junto com o objeto
        noticia = {
            "_id": idBebida,
            "titulo": document.getElementById('titulo').value,
            "autor": document.getElementById('autor').value,
            "descricao": document.getElementById('descricao').value,
            "conteudo": document.getElementById('conteudo').value,
            "data": document.getElementById('data').value,
            "capa": document.getElementById('capa').value
        }
    } else {
        noticia = {
            "titulo": document.getElementById('titulo').value,
            "autor": document.getElementById('autor').value,
            "descricao": document.getElementById('descricao').value,
            "conteudo": document.getElementById('conteudo').value,
            "data": document.getElementById('data').value,
            "capa": document.getElementById('capa').value
        }
    }
    salvaNoticia(noticia)
})

async function salvaNoticia(noticia) {    
    if (noticia.hasOwnProperty('_id')) { //Se a notícia tem o id iremos alterar os dados (PUT)
        // Fazer a solicitação PUT para o endpoint das bebidas
        await fetch(`${urlBase}/noticias`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(noticia)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ Notícia alterada com sucesso!')
                    //Limpar o formulário
                    document.getElementById('formNoticia').reset()
                } else if (data.errors) {
                    // Caso haja erros na resposta da API
                    const errorMessages = data.errors.map(error => error.msg).join("\n");
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${errorMessages}</span>`
                    resultadoModal.show();
                } else {
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${JSON.stringify(data)}</span>`
                    resultadoModal.show();
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar a notícia: ${error.message}</span>`
                resultadoModal.show();
            });

    } else { //caso não tenha o ID, iremos incluir (POST)
        // Fazer a solicitação POST para o endpoint das notícias
        await fetch(`${urlBase}/noticias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access-token": access_token //envia o token na requisição
            },
            body: JSON.stringify(noticia)
        })
            .then(response => response.json())
            .then(data => {
                // Verificar se o token foi retornado        
                if (data.acknowledged) {
                    alert('✔ Notícia incluída com sucesso!')
                    //Limpar o formulário
                    document.getElementById('formNoticia').reset()
                } else if (data.errors) {
                    // Caso haja erros na resposta da API
                    const errorMessages = data.errors.map(error => error.msg).join("\n");
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${errorMessages}</span>`
                    resultadoModal.show();
                } else {
                    document.getElementById("mensagem").innerHTML = `<span class='text-danger'>${JSON.stringify(data)}</span>`
                    resultadoModal.show();
                }
            })
            .catch(error => {
                document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar a notícia: ${error.message}</span>`
                resultadoModal.show();
            });
    }
}