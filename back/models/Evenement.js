import mongoose, { Schema } from "mongoose";

const evenementSchema = new Schema({
  label: String,
  jour: Number,
  mois: Number,
  annee: Number,
  heure: Number,
  minute: Number,
  date: Number,
  detail: String,
  elementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Element' },
})

const Evenement = mongoose.model('Evenement', evenementSchema)
export default Evenement