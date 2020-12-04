const db = require("../models");
const Livro = db.livros;
const LivroRegistro = db.livroRegistro;
const Emprestimo = db.emprestimo;

exports.createLivroService = async (id, titulo, autor) => {
  const livro = new Livro({
    idRegistro: id,
    titulo,
    autor,
    status: 'Disponível'
  });

  const livroPromise = livro.save(livro).catch(err => console.log(err));

  return livroPromise
};

exports.create = async (req, res) => {
    const titulo = req.body.titulo
    const autor = req.body.autor
    const quantidade = req.body.quantidade

    const livroRegistro = new LivroRegistro({
      titulo,
      autor,
      quantidade
    });

    const livroRegistroPromise = livroRegistro
      .save(livroRegistro)
      .then(async data => {
        const id = data.id
        for(var i = 0; i < data.quantidade; i++) {
          let response = await this.createLivro(id, titulo, autor)
          console.log(response)
        }
        res.send(data)
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

  LivroRegistro.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Não foi possível listar os registros de livros."
      });
    });
};

exports.findAllBooksByRegisterId = async (req, res) => {
  const idRegistro = req.params.id
  var condition = idRegistro ? { idRegistro: { $regex: new RegExp(idRegistro), $options: "i" } } : {};

  console.log(idRegistro)
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
}

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

exports.emprestimo = async (req, res) => {
  const clienteId = req.params.clienteId;
  const registroLivroId = req.params.livroId;

  const emprestimo = new Emprestimo({
    clienteId,
    livroId,
  });

  emprestimo
    .save(emprestimo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Não foi possível emprestar."
      });
    });
}