import mongoose, { Schema } from "mongoose";

const favorisSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
})

const Favoris = mongoose.model('Favoris', favorisSchema)
export default Favoris
