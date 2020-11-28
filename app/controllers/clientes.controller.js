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
            err.message || "Não foi possível criar."
        });
      });
  };

  exports.findAll = (req, res) => {
    const nome = req.query.nome;
    var condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};
  
    Cliente.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Não foi possível listar os clientes."
        });
      });
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