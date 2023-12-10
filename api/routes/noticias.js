import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'noticias'

import auth from '../middleware/auth.js'

const validaNoticia = [
    check("titulo")
     .not()
     .isEmpty()
     .trim()
     .withMessage("É obrigatório informar o título da notícia!"),
    check("autor")
     .not()
     .isEmpty()
     .trim()
     .withMessage("É obrigatório informar o autor da notícia!"),
    check("descricao")
     .not()
     .isEmpty()
     .trim()
     .withMessage("É obrigatório informar uma breve descrição da notícia! No máximo 70 caracteres."),
    check("data")
     .not()
     .isEmpty()
     .trim()
     .withMessage("É obrigatório informar a data da notícia!"),
    check("conteudo")
     .not()
     .isEmpty()
     .trim()
     .withMessage("É obrigatório informar o conteúdo!"),
    check("capa")
     .not()
     .isEmpty()
     .trim()
     .isURL()
     .withMessage("É obrigatório informar o link de uma capa para a notícia!")
];

/**
 * GET /api/noticias
 * Lista todas as notícias registradas no banco de dados
 */
router.get('/', async(req, res) => {
    try{
        db.collection(nomeCollection).find().sort({data: -1}).toArray((err, docs) => {
            if(!err){
                res.status(200).json(docs)
            }
        })
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem das notícias',
                param: '/'
            }]
        })
    }
});

/**
 * GET /api/noticias/id/:id
 * Lista uma notícia pelo id
 */
router.get('/id/:id', async(req, res)=> {
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}})
        .toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            } else {
                res.status(200).json(docs) // retorna o documento
            }
        })
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
});

/**
 * DELETE /api/noticias/:id
 * Apaga uma notícia pelo id
 */
router.delete('/:id', auth, async(req, res) => {
    await db.collection(nomeCollection)
    .deleteOne({"_id": { $eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
});

/**
 * POST /api/noticias
 * Insere uma nova notícia
 */
router.post('/', auth, validaNoticia, async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
});

/**
 * PUT /api/noticias
 * Altera uma notícia
 */
router.put('/', auth, validaNoticia, async(req, res) => {
    let idDocumento = req.body._id //armazenando o id do documento
    delete req.body._id //iremos remover o id do body
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
        .updateOne({'_id': {$eq : ObjectId(idDocumento)}},
                   { $set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
});

export default router;