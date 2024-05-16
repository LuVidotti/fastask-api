const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();
const DB_SENHA = process.env.DB_SENHA;
const DB_USER = process.env.DB_USER;
const PORT = 3000;
const rotaUsuarios = require('./routes/usuarios');
const rotaTarefas = require("./routes/tarefas");
const rotaListas = require('./routes/listas');
const rotaListaTarefas = require("./routes/listaTarefas");

//config
    //body-parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //mongoose
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_SENHA}@cluster0.ayipw1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
        console.log("Conectado ao banco de dados com sucesso!!!");
    }).catch((erro) => {
        console.log("Erro ao se conectar ao banco de dados");
    })

//rotas
app.get("/", (req,res) => {
    res.send("Ola mundo");
})

app.use('/usuarios', rotaUsuarios);
app.use("/tarefas", rotaTarefas);
app.use("/listas", rotaListas);
app.use("/lista-tarefas", rotaListaTarefas);

//server
app.listen(PORT, () => {
    console.log(`Servidor rodando da porta ${PORT}`);
})