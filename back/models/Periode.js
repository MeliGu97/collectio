import mongoose, { Schema } from "mongoose";

const periodeSchema = new Schema({
  label: String,
  dateDebut: Number,
  dateFin: Number,
  imageUrl: String,
  couleur: String,
  collectionsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }]
})


const Periode = mongoose.model('Periode', periodeSchema)
export default Periode
