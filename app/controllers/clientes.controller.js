const db = require("../models");
const Cliente = db.clientes;

async function contaOcorrencias(nome, res) {
    var condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};
  
    try {
      const quantidade = await Cliente.find(condition)
      return quantidade.length
    } catch (e) {
      return -1
    }
}

exports.create = async (req, res) => {
    if (!req.body.nome) {
      res.status(400).send({ message: "Erro. Nome obrigatório." });
      return;
    }

    const nome = req.body.nome;
    const ocorrenciasNome = await contaOcorrencias(nome)

    if (ocorrenciasNome === -1) {
      res.status(500).send({
        message: 'Erro'
      });
      return;
    } else if (ocorrenciasNome > 0) {
      res.status(400).send({
        message: 'Nome já utilizado. Sorry.'
      });
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

  exports.findAll = async (req, res) => {


    const nome = req.query.nome;
    console.log(nome)
    var condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};
  
    const quantidade = await contaOcorrencias(nome)

    console.log(quantidade, ' foram contadas.')

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
    const id = req.params.id;
  
    Cliente.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Não existe cliente com o id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Erro ao buscar cliente." });
      });
  };

  exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Body obrigatório"
      });
    }
  
    const id = req.params.id;
  
    Cliente.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: 'Não foi possível atualizar.'
          });
        } else res.send({ message: "Cliente atualizado com sucesso." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Erro atualizando"
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Cliente.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: 'Não foi possível deletar.'
          });
        } else {
          res.send({
            message: "Deletado com sucesso."
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: 'Erro ao deletar.'
        });
      });
  };

  exports.deleteAll = (req, res) => {
    Cliente.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} clientes foram deletados.`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocorreu um erro"
        });
      });
  };