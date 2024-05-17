const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const upload = require('../config/multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
const verificaToken = require('../auth/auth');
const path = require("path");

router.post("/", upload.single("file"), (req,res) => {
    const file = req.file;

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        return res.status(400).json({message: "Erro, nome invalido"});
    }

    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    if(!req.body.senha2 || typeof req.body.senha2 === undefined || req.body.senha2 === null) {
        return res.status(400).json({message: "Erro, senha2 invalida"});
    }

    if(req.body.senha.length < 4) {
        return res.status(400).json({message: "Erro, senha muito curta"});
    }

    if(req.body.senha2 !== req.body.senha) {
        return res.status(400).json({message: "Erro, as senhas devem coincidir"});
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.senha, salt);

    const novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hash,
        fotoPerfil: file.path
    }

    new Usuario(novoUsuario).save().then((usuarioCriado) => {
        return res.status(201).json({message: "Conta criada com sucesso!!!", usuarioCriado:usuarioCriado});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.post("/login", (req,res) => {
    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    Usuario.findOne({email: req.body.email}).then((usuario) => {
        if(!usuario || usuario === null) {
            return res.status(404).json({message: "Nenhum usuario emcontrado com este e-mail"});
        }

        bcrypt.compare(req.body.senha, usuario.senha, (erro, batem) => {
            if(erro) {
                return res.status(400).json({message: "Houve um erro ao verificar senha"});
            }

            if(batem) {
                const token = jwt.sign({userId: usuario._id}, SECRET, {expiresIn: "1h"});
                return res.status(201).json({message: "Login realizado com sucesso!!!", token:token});
            } else {
                return res.status(400).json({message: "Senha incorreta"});
            }
        })
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/perfil", verificaToken, (req,res) => {
    const user = req.user;

    Usuario.findOne({_id: user._id}).then((usuario) => {
        return res.status(200).json(usuario);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor", erro:erro});
    })
})

router.get("/imagem/:url", (req,res) => {
    const filePath = path.join(__dirname, "../uploads/", req.params.url);
    return res.status(200).sendFile(filePath);
})

module.exports = router;