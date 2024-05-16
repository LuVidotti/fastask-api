const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/ListaTarefa");
const ListaTarefa = mongoose.model("listaTarefas");
const verificaToken = require("../auth/auth");

router.post("/", verificaToken, (req,res) => {
    const user = req.user;

    if(!req.body.descricao || typeof req.body.descricao === undefined || req.body.descricao === null) {
        return res.status(400).json({message: "Erro, descricao invalida"});
    }

    const novaListaTarefa = {
        descricao: req.body.descricao,
        userId: user._id,
        listaId: req.body.listaId
    }

    new ListaTarefa(novaListaTarefa).save().then((listaTarefaSalva) => {
        return res.status(201).json({message: "Tarefa adicionada com sucesso!!!", listaTarefaSalva:listaTarefaSalva});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/:idLista", verificaToken, (req,res) => {
    const user = req.user;

    ListaTarefa.find({userId: user._id, listaId: req.params.idLista}).populate("listaId").then((listaTarefas) => {
        return res.status(200).json(listaTarefas);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.delete("/:id", verificaToken, (req,res) => {
    const user = req.user;

    ListaTarefa.deleteOne({userId: user._id, _id: req.params.id}).then(() => {
        return res.status(200).json({message: "Tarefa excluida com sucesso!!!"});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

module.exports = router;