module.exports = app => {
    const livros = require("../controllers/livros.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", livros.create);
  
    // Retrieve all Tutorials
    router.get("/", livros.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", livros.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", livros.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", livros.delete);
  
    // Create a new Tutorial
    router.delete("/", livros.deleteAll);
  
    app.use('/api/livros', router);
  };