const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListaTarefa = new Schema({
    descricao: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },
    listaId: {
        type: Schema.Types.ObjectId,
        ref: "listas"
    }
})

mongoose.model("listaTarefas", ListaTarefa);