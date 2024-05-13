const mongoose = require('mongoose')

const periodeSchema = new mongoose.Schema({
  label: String,
  dateDebut: Number,
  dateFin: Number,
  imageUrl: String,
  couleur: String,
  collectionsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }]
})

module.exports = mongoose.model('Periode', periodeSchema)
