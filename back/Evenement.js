const mongoose = require('mongoose')

const evenementSchema = new mongoose.Schema({
  label: String,
  date: Number,
})

module.exports = mongoose.model('Evenement', evenementSchema)
