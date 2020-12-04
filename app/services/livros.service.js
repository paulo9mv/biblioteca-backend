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

exports.updateBookSituation = (id, situacao) => {
  const livroPromise = Livro.findByIdAndUpdate(id, { situacao }, { useFindAndModify: false })
    .catch(err => console.log(err));

  return livroPromise
};

exports.countBooksBorrowedByClient = (id) => {
  var conditionRegistro = id ? { 
    clienteId: { $regex: new RegExp(id), $options: "i" }
  } : {};

  return Emprestimo.find(conditionRegistro).then(data => data.length).catch(err => console.log(err))
}

exports.findBooksBorrowedByClient = (id) => {
  var conditionRegistro = id ? { 
    clienteId: { $regex: new RegExp(id), $options: "i" }
  } : {};

  return Emprestimo.find(conditionRegistro).catch(err => console.log(err))
}

exports.deleteBorrowedBookFromClient = (id) => {
  return Emprestimo.findByIdAndRemove(id)
    .catch(e => console.log(e));
}