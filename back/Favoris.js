const mongoose = require('mongoose')

const favorisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
})

module.exports = mongoose.model('Favoris', favorisSchema)
