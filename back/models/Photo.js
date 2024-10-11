import mongoose, { Schema } from "mongoose";

const PhotoSchema = new Schema({
    id: Number,
    width: Number,
    height: Number,
    url: String,
    photographer: String,
    photographer_url: String,
    photographer_id: Number,
    avg_color: String,
    src: {
      original: String,
      large2x: String,
      large: String,
      medium: String,
      small: String,
      portrait: String,
      landscape: String,
      tiny: String,
    },
    liked: Boolean,
  });


const Photo = mongoose.model('Photo', PhotoSchema)
export default Photo
