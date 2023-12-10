const urlBase = 'https://worldender.vercel.app/api';
//const urlBase = 'http://localhost:4000/api';
const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"));
const access_token = localStorage.getItem("token") || null;
const noticiaModal = new bootstrap.Modal(document.getElementById("modalNoticia"));

async function carregaNoticias() {
    const cardNoticias = document.getElementById('dadosCard')
    cardNoticias.innerHTML = "" //Limpa tudo antes de carregar as notícias
    // Fazer a solicitação GET para o endpoint das notícias
    await fetch(`${urlBase}/noticias`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(noticia => {
                cardNoticias.innerHTML += `
                <div class="col mt-5">
                    <div class="card" style="width: 18rem;">
                    <img src="${noticia.capa}" style="width: 286px; height: 182px;" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${noticia.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Autor: ${noticia.autor}</h6>
                    <p class="card-text">${noticia.descricao}</p>
                    <a href="#" class="btn btn-danger" onclick="carregaNoticiaModal('${noticia._id}')">Ler Notícia</a>
                    </div>
                </div>
                `
            })
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar a notícia: ${error.message}</span>`
            resultadoModal.show();
        });
}

async function carregaNoticiaModal(id){
    buscaNoticiaPeloId(id)
    noticiaModal.show()
}

async function buscaNoticiaPeloId(id) {
    await fetch(`${urlBase}/noticias/id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data[0]) { //Iremos pegar os dados e colocar na página.
                document.getElementById('titulo').innerText = data[0].titulo,
                document.getElementById('autor').innerText = "Autor: ",
                document.getElementById('autor').innerText += data[0].autor,
                document.getElementById('descricao').innerText = data[0].descricao,
                document.getElementById('conteudo').innerText = data[0].conteudo,
                document.getElementById('data').innerText = data[0].data,
                document.getElementById('capa').setAttribute("src", data[0].capa)
            }
        })
        .catch(error => {
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Erro ao salvar a notícia: ${error.message}</span>`
            resultadoModal.show();
        });

}