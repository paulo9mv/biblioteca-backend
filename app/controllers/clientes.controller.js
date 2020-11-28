const db = require("../models");
const Cliente = db.clientes;

exports.create = (req, res) => {
    if (!req.body.nome) {
      res.status(400).send({ message: "Erro. Nome obrigatório." });
      return;
    }
  
    const cliente = new Cliente({
      nome: req.body.nome,
      email: req.body.email,
    });
  
    cliente
      .save(cliente)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algo errado aconteceu. Tente mais tarde."
        });
      });
  };

exports.findAll = (req, res) => {
  
};

exports.findOne = (req, res) => {
  
};

exports.update = (req, res) => {
  
};

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};

exports.findAllPublished = (req, res) => {
  
};