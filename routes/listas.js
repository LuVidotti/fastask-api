const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Lista');
const Lista = mongoose.model("listas");
const verificaToken = require('../auth/auth');

router.post("/", verificaToken, (req,res) => {
    const user = req.user;

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        return res.status(400).json({message: "Erro, nome de lista invalido"});
    }

    const novaLista = {
        nome: req.body.nome,
        userId: user._id
    }

    new Lista(novaLista).save().then((listaSalva) => {
        return res.status(201).json({message: "Lista adicionada com sucesso!!!", listaSalva:listaSalva});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/", verificaToken, (req,res) => {
    const user = req.user;

    Lista.find({userId: user._id}).then((listas) => {
        return res.status(200).json(listas);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/:id", verificaToken, (req,res) => {
    const user = req.user;

    Lista.findOne({_id: req.params.id, userId: user._id}).then((lista) => {
        return res.status(200).json(lista)
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.delete("/:id", verificaToken, (req,res) => {
    const user = req.user;

    Lista.deleteOne({_id: req.params.id, userId: user._id}).then((listaDeletada) => {
        return res.status(200).json({message: "Lista deletada com sucesso!!!", listaDeletada:listaDeletada});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

module.exports = router;