module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nome: { type: String, unique: true },
        email: { type: String, unique: true },
      },
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Cliente = mongoose.model("cliente", schema);
    return Cliente;
  };