const mongoose = require('mongoose')

const evenementSchema = new mongoose.Schema({
  label: String,
  jour: Number,
  mois: Number,
  annee: Number,
  heure: Number,
  minute: Number,
  date: Number,
  detail: String,
  elementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Element' },
})

module.exports = mongoose.model('Evenement', evenementSchema)
