const db = require("../models");
const Cliente = db.clientes;
const LivroRegistro = db.livroRegistro;
const Emprestimo = db.emprestimo;

exports.findOne = (id) => {
  return Cliente.findById(id).catch(e => console.log(e))
};

exports.findAll = () => {
    return Cliente.find({}).catch(err => console.log(err));
}