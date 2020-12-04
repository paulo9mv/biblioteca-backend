module.exports = app => {
    const livros = require("../controllers/livros.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", livros.create);
  
    // Retrieve all Tutorials
    router.get("/", livros.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", livros.findOne);

    // Retrieve a single Tutorial with id
    router.get("/registro/:id", livros.findAllBooksByRegisterId);
  
    // Update a Tutorial with id
    router.put("/:id", livros.update);
  
    // Deleta específico
    router.delete("/:id", livros.delete);
  
    // Deleta todos
    router.delete("/", livros.deleteAll);

    // Retrieve a single Tutorial with id
    router.get("/emprestimo/all", livros.getEmprestimo);

    // Empresta livros
    router.post("/emprestimo/:clienteId/:livroId", livros.emprestimo);

    // Empresta livros
    router.delete("/emprestimo/:id", livros.devolucao);
  
    app.use('/api/livros', router);
  };