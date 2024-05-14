const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tarefa = new Schema({
    descricao: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    },
    isProximosDias: {
        type: Boolean,
        required: true
    }
});

mongoose.model("tarefas", Tarefa);