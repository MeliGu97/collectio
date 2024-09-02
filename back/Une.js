const mongoose = require('mongoose')

const uneSchema = new mongoose.Schema({
  order: Number,
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
})

module.exports = mongoose.model('Une', uneSchema)
