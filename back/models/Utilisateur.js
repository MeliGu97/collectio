import mongoose, { Schema } from "mongoose";


const utilisateurSchema = new Schema({
  prenom: String,
  nom: String,
  nomUtilisateur: {
    type: String,
    unique: true
  },
  motDePasse: String,
  role: String,
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema)
export default Utilisateur