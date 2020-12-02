const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Conectado!");
  })
  .catch(err => {
    console.log("Erro na conexão", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello World da Biblioteca!" });
});

require("./app/routes/clientes.routes")(app);
require("./app/routes/livros.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});