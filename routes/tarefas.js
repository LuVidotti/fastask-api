const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Tarefa");
const Tarefa = mongoose.model("tarefas");
const verificaToken = require("../auth/auth");


router.post("/", verificaToken, (req,res) => {
    const user = req.user;

    if(!req.body.descricao || typeof req.body.descricao === undefined || req.body.descricao === null) {
        return res.status(400).json({message: "Erro, descricao invalida"});
    }

    const novaTarefa = {
        descricao: req.body.descricao,
        userId: user._id
    }

    new Tarefa(novaTarefa).save().then((tarefaSalva) => {
        return res.status(201).json({message: "Tarefa criada com sucesso!!!", tarefaSalva:tarefaSalva});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/", verificaToken, (req,res) => {
    const user = req.user;

    Tarefa.find({userId: user._id, isProximosDias: false}).populate("userId").then((tarefas) => {
        return res.status(200).json(tarefas);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.delete("/:id", verificaToken, (req,res) => {
    const user = req.user;

    Tarefa.deleteOne({_id: req.params.id, userId: user._id}).then((tarefaDeletada) => {
        return res.status(200).json({message: "Tarefa deletada com sucesso!!!", tarefaDeletada:tarefaDeletada});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.post("/proximos-dias", verificaToken, (req,res) => {
    const user = req.user;

    if(!req.body.descricao || typeof req.body.descricao === undefined || req.body.descricao === null) {
        return res.status(400).json({message: "Erro, descricao invalida"});
    }

    const novaTarefa = {
        descricao: req.body.descricao,
        userId: user._id,
        isProximosDias: true
    }

    new Tarefa(novaTarefa).save().then((tarefaSalva) => {
        return res.status(201).json({message: "Tarefa criada com sucesso!!!", tarefaSalva:tarefaSalva});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/proximos-dias", verificaToken, (req,res) => {
    const user = req.user;

    Tarefa.find({userId: user._id, isProximosDias: true}).populate("userId").then((tarefas) => {
        return res.status(200).json(tarefas);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

module.exports = router;