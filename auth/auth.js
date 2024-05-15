const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET = process.env.SECRET;
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model("usuarios");

function verificaToken(req, res, next) {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({message: "Erro, faça login para realizar esta ação"});
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Erro, login necessario"});
        }

        Usuario.findOne({_id: decoded.userId}).then((usuario) => {
            if(!usuario || usuario === null) {
                return res.status(404).json({message: "Usuario nao encontrado"});
            }

            req.user = usuario;
            next();
        }).catch((erro) => {
            return res.status(500).json({errorMessage: "Erro interno no servidor"});
        })
    })
}

module.exports = verificaToken;