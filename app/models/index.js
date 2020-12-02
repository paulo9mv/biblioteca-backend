const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.clientes = require("./cliente.model.js")(mongoose);
db.livros = require("./livro.model.js")(mongoose);

module.exports = db;