const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  nomUtilisateur: {
    type: String,
    unique: true
  },
  motDePasse: String,
  role: String
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
