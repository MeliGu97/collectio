const mongoose = require('mongoose')

const evenementSchema = new mongoose.Schema({
  label: String,
  date: Number,
  elementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Element' },
})

module.exports = mongoose.model('Evenement', evenementSchema)
