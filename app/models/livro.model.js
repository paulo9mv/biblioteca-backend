module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        titulo: String,
        autor: String,
        situacao: String,
        idRegistro: String
      },
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Livro = mongoose.model("livro", schema);
    return Livro;
  };