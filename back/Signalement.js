const mongoose = require('mongoose')

const signalementSchema = new mongoose.Schema({
  description: String,
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  date: Date,
})

module.exports = mongoose.model('Signalement', signalementSchema)
