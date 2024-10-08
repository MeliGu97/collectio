import mongoose, { Schema } from "mongoose";


const signalementSchema = new Schema({
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  description: String,
  date: Date,

  reponseUtili: String,
  reponseDate: Date,

})

const Signalement = mongoose.model('Signalement', signalementSchema)
export default Signalement