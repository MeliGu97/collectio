import mongoose, { Schema } from "mongoose";

const uneSchema = new Schema({
  date: Date,
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
})

const Une = mongoose.model('Une', uneSchema)
export default Une