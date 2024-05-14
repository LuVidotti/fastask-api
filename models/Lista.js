const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Lista = new Schema({
    nome: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "usuarios"
    }
})

mongoose.model("listas", Lista);