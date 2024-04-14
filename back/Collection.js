const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  label: String,
  description: String,
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Element' }],
  periodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Periode' }],
  imageUrl: String,
})

module.exports = mongoose.model('Collection', collectionSchema)
