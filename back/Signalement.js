const mongoose = require('mongoose')

const signalementSchema = new mongoose.Schema({
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  description: String,
  date: Date,

  reponseUtili: String,
  reponseDate: Date,

})

module.exports = mongoose.model('Signalement', signalementSchema)
