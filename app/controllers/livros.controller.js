const db = require("../models");
const Livro = db.livros;

exports.create = async (req, res) => {
    if (!req.body.titulo) {
      res.status(400).send({ message: "Erro. Nome obrigatório." });
      return;
    }
    
    const livro = new Livro({
      titulo: req.body.titulo,
      autor: req.body.autor,
    });
  
    livro
      .save(livro)
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
    const titulo = req.query.titulo;
    var condition = titulo ? { titulo: { $regex: new RegExp(titulo), $options: "i" } } : {};

    Livro.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Não foi possível listar os livros."
        });
      });
  };

  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Livro.findById(id)
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
  
    Livro.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: 'Não foi possível atualizar.'
          });
        } else res.send({ message: "Livro atualizado com sucesso." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Erro atualizando"
        });
      });
  };

  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Livro.findByIdAndRemove(id)
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
    Livro.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} livros foram deletados.`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocorreu um erro"
        });
      });
  };