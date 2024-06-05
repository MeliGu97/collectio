const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  label: String,
  description: String,
  elementsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Element' }],
  periodesId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Periode' }],
  imageUrl: String,
  picto: String,
  categorie: String,
  sousCategorie: String,
})

module.exports = mongoose.model('Collection', collectionSchema)
