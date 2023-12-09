import express from 'express';

const app = express();
const port = 4000;

//import das rotas do app
import rotasUsuarios from './routes/usuarios.js';
import rotasNoticias from './routes/noticias.js';

app.use(express.json()); //irá fazer o parse de arquivos JSON

//Rotas de conteúdo público
app.use('/', express.static('public'));

//Configura o favicon
app.use('/favicon.ico', express.static('public/favicon.ico'));

//Rotas de API
app.use('/api/noticias', rotasNoticias);
app.use('/api/usuarios', rotasUsuarios);

app.get('/api', (req, res) => {
    res.status(200).json(
        {
            "message": 'WorldEnder API 🫡 100% funcional, sir!',
            "version": '1.0.0'
        }
    )
});

//Rotas de exceção -> deve ser a última!
app.use(function(req, res) {
    res.status(404).json({
        errors: [{
            "value": `${req.originalUrl}`,
            "msg": `A rota ${req.originalUrl} não existe nesta API!`,
            "param": `Invalid route`
        }]
    })
});

app.listen(port, function(){
    console.log(`💻 Servidor rodando na porta ${port}`)
});