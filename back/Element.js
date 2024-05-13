const mongoose = require('mongoose')

const elementSchema = new mongoose.Schema({
  label: String,
  description: String,
  collectionsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  imageUrl: String,
})

module.exports = mongoose.model('Element', elementSchema)
