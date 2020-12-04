const db = require("../models");
const Livro = db.livros;
const LivroRegistro = db.livroRegistro;
const Emprestimo = db.emprestimo;

exports.createLivroService = async (id, titulo, autor) => {
  const livro = new Livro({
    idRegistro: id,
    titulo,
    autor,
    situacao: 'Disponível'
  });

  const livroPromise = livro.save(livro).catch(err => console.log(err));

  return livroPromise
};

exports.findOneLivro = async (id) => {
  return Livro.findById(id).catch(e => console.log(e))
}

exports.findAllBooksByRegisterId = async (registerId) => {
  const idRegistro = registerId
  var conditionRegistro = idRegistro ? { 
    idRegistro: { $regex: new RegExp(idRegistro), $options: "i" },
  } : {};

  return Livro.find(conditionRegistro).catch(err => console.log(err))
}

exports.findAllBooksAvailableByRegisterId = async (registerId) => {
  const idRegistro = registerId
  var conditionRegistro = idRegistro ? { 
    idRegistro: { $regex: new RegExp(idRegistro), $options: "i" },
    situacao: { $regex: new RegExp('Disponível'), $options: "i" }
  } : {};

  return Livro.find(conditionRegistro).catch(err => console.log(err))
}

exports.findAllBooksBorrowedByRegisterId = async (registerId) => {
  const idRegistro = registerId
  var conditionRegistro = idRegistro ? { 
    idRegistro: { $regex: new RegExp(idRegistro), $options: "i" },
    situacao: { $regex: new RegExp('Emprestado'), $options: "i" }
  } : {};

  return Livro.find(conditionRegistro).catch(err => console.log(err))
}

exports.updateBookSituation = (id, situacao) => {
  const livroPromise = Livro.findByIdAndUpdate(id, { situacao }, { useFindAndModify: false })
    .catch(err => console.log(err));

  return livroPromise
};

exports.countBooksBorrowedByClient = (id) => {
  var conditionRegistro = id ? { 
    clienteId: { $regex: new RegExp(id), $options: "i" },
    situacao: { $regex: new RegExp('Emprestado'), $options: "i" },
  } : {};

  return Emprestimo.find(conditionRegistro).then(data => data.length).catch(err => console.log(err))
}

exports.findBooksBorrowedByClient = (id) => {
  var conditionRegistro = id ? { 
    clienteId: { $regex: new RegExp(id), $options: "i" },
    situacao: { $regex: new RegExp('Emprestado'), $options: "i" }
  } : {};

  return Emprestimo.find(conditionRegistro).catch(err => console.log(err))
}

exports.deleteBorrowedBookFromClient = (id) => {
  return Emprestimo.findByIdAndUpdate(id, { situacao: 'Devolvido' }, { useFindAndModify: false })
    .catch(e => console.log(e));
}

exports.findAllBorrows = () => {
  var conditionRegistro = { situacao: { $regex: new RegExp('Emprestado'), $options: "i" }};

  return Emprestimo.find(conditionRegistro)
    .catch(err => console.log(err));
}

exports.countAllBorrowsByClient = (id) => {
  var conditionRegistro = id ? { 
    clienteId: { $regex: new RegExp(id), $options: "i" },
  } : {};

  return Emprestimo.find(conditionRegistro).then(data => data.length).catch(err => console.log(err))
}

exports.updateBook = (id, data) => {
  return Livro.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .catch(err => console.log(err));
}