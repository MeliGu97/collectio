import mongoose, { Schema } from "mongoose";

const uneSchema = new Schema({
  order: Number,
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
})

const Une = mongoose.model('Une', uneSchema)
export default Une