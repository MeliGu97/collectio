// const mongoose = require('mongoose')
import mongoose, { Schema } from "mongoose";


const elementSchema = new Schema({
  label: String,
  description: String,
  collectionsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  imageUrl: String,
})

// module.exports = mongoose.model('Element', elementSchema)
const Element = mongoose.model('Element', elementSchema)
export default Element
