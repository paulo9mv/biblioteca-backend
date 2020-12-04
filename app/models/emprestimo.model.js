module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        clienteId: String,
        livroId: String,
        dataDevolucao: String
      },
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Emprestimo = mongoose.model("emprestimo", schema);
    return Emprestimo;
  };