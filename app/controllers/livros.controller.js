const { emprestimo } = require("../models");
const db = require("../models");
const Livro = db.livros;
const LivroRegistro = db.livroRegistro;
const Emprestimo = db.emprestimo;

const moment = require('moment')

const livroService = require('../services/livros.service')
const clienteService = require('../services/cliente.service')

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

  LivroRegistro.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Não existe livro com o id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Erro ao buscar cliente." });
    });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Body obrigatório"
    });
  }

  const id = req.params.id;

  const livros = await livroService.findAllBooksByRegisterId(id)
  for(var i = 0; i < livros.length; i++) {
    let livro = livros[i]
    await livroService.updateBook(livro.id, req.body)
  }

  LivroRegistro.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
    const data = []
    for(var i = 0; i < emprestimos.length; i++) {
      let cliente = await clienteService.findOne(emprestimos[i].clienteId)
      let livro = await livroService.findOneLivro(emprestimos[i].livroId)
      data.push({
        emprestimo: emprestimos[i],
        cliente,
        livro
      })
    }
    res.send(data)
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

  const livrosEmprestados = await livroService.findBooksBorrowedByClient(clienteId)
  if (livrosEmprestados.length === 2) {
    res.status(400).send({
      message: `Usuário já possui ${livrosEmprestados.length} emprestados!`
    })
    return;
  }
  const livrosEmAtraso = livrosEmprestados.filter(item => {
    const startTime = moment(item.createdAt)
    const end = moment()

    var duration = moment.duration(end.diff(startTime));
    var minutes = duration.asMinutes();

    return minutes > 5
  })

  if (livrosEmAtraso.length > 0) {
    res.status(400).send({
      message: 'Usuário possui livros em atraso.'
    })
    return
  }


  const idLivro = livrosDisponiveis[0].id
  await livroService.updateBookSituation(idLivro, 'Emprestado')

  const emprestimo = new Emprestimo({
    clienteId,
    livroId: idLivro,
    situacao: 'Emprestado'
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