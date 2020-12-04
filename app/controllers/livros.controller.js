const { emprestimo } = require("../models");
const db = require("../models");
const Livro = db.livros;
const LivroRegistro = db.livroRegistro;
const Emprestimo = db.emprestimo;

const livroService = require('../services/livros.service')

exports.create = async (req, res) => {
    const titulo = req.body.titulo
    const autor = req.body.autor
    const quantidade = req.body.quantidade

    const livroRegistro = new LivroRegistro({
      titulo,
      autor,
      quantidade
    });

    livroRegistro
      .save(livroRegistro)
      .then(async data => {
        const id = data.id
        for(var i = 0; i < data.quantidade; i++) {
          await livroService.createLivroService(id, titulo, autor)
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

  try {
    const data = await livroService.findAllBooksByRegisterId(idRegistro)

    res.send(data)
  } catch (e) {
    res.status(500).send({
      message: "Erro ao buscar"
    });
  }
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

exports.getEmprestimo = async (req, res) => {
  try {
    const emprestimos = await livroService.findAllBorrows()
    res.send(emprestimos)
  } catch (e) {
    res.status(500).send({
      message: 'Ocorreu um erro'
    })
  }
}

exports.emprestimo = async (req, res) => {
  const clienteId = req.params.clienteId;
  const registroLivroId = req.params.livroId;

  const livrosDisponiveis = await livroService.findAllBooksAvailableByRegisterId(registroLivroId)

  if (livrosDisponiveis.length === 0){
    res.status(400).send({
      message: 'Não há livros disponíveis'
    })
    return;
  }

  const livrosEmprestados = await livroService.countBooksBorrowedByClient(clienteId)
  if (livrosEmprestados === 1) {
    res.status(400).send({
      message: `Usuário já possui ${livrosEmprestados} emprestados!`
    })
    return;
  }

  const idLivro = livrosDisponiveis[0].id
  const livroAtt = await livroService.updateBookSituation(idLivro, 'Emprestado')
  console.log(livroAtt)

  const emprestimo = new Emprestimo({
    clienteId,
    livroId: idLivro,
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

exports.devolucao = async (req, res) => {
  const id = req.params.id;
  try {
    const emprestimoRemovido = await livroService.deleteBorrowedBookFromClient(id)
    const livroId = emprestimoRemovido.livroId
    await livroService.updateBookSituation(livroId, 'Disponível')

    console.log(emprestimoRemovido)
    res.status(200).send({
      message: 'Livro devolvido com sucesso'
    })
  } catch (e) {
    res.status(400).send({
      message: 'Erro ao devolver'
    })
  }
}

// clienteId 5fc989349df88f0730e05398
// registroLivroId 5fc989429df88f0730e05399