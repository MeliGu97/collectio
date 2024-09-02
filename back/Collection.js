const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  label: String,
  description: String,
  elementsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Element' }],
  periodesId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Periode' }],
  imageUrl: String,
  picto: String,
  categorie: String,
  sousCategorie: String,
  public: Boolean,
})

module.exports = mongoose.model('Collection', collectionSchema)
