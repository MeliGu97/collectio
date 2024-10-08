import Utilisateur from "../models/Utilisateur.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// #region get utili by Id
const getUtilisateurById = async (req, res) => {
    try {
      const objectId = req.params.id; // L'ID est déjà dans le format attendu
      const utilisateurCible = await Utilisateur.findById(objectId);
      if (!utilisateurCible) {
        return res.status(404).json({ message: 'Élément non trouvé' });
      }
      res.json(utilisateurCible);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    };


// #regiron ----
// #region create utili
const createUtilisateur = async (req, res) => {
    try {
      const { prenom, nom, nomUtilisateur, motDePasse, role } = req.body;
  
      // On verifie que le nom d'utilisateur n'existe pas déjà 
      const existingUser = await Utilisateur.findOne({ nomUtilisateur });
      if (existingUser) {
        return res.status(400).json({ message: 'Ce nom de collectionneur existe déjà' });
      }
  
      // Hache le mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 10);
  
      // Crée un utili
      const newUser = new Utilisateur({
        prenom,
        nom,
        nomUtilisateur,
        motDePasse: hashedPassword,
        role,
      });
  
      // Sauvegarde dans bdd
      await newUser.save();
  
      res.status(201).json({ message: 'Utilisateur créer avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création', error });
    }
  };



// #region Login
const createConnexionByUtilisateur = async (req, res) => {
    try {
        const { nomUtilisateur, motDePasse } = req.body;
  
        // Verifie si l'utilisateur existe
        const user = await Utilisateur.findOne({ nomUtilisateur });
        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
  
        // puis si le mdp est correcte
        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
  
      // Si les deux sont bons, on génère un token JWT
    //   const token = jwt.sign({ _id: user._id, nom: user.nom, prenom: user.prenom, nomUtilisateur: user.nomUtilisateur, role: user.role }, 'secret_key', { expiresIn: '2h' });
      const token = jwt.sign({ _id: user._id, nom: user.nom, prenom: user.prenom, nomUtilisateur: user.nomUtilisateur, role: user.role }, process.env.JWT_SECRET);
// si expire en 2h il faut déco l'utili et lui demander de se reco

        // si les deux sont bons alors ok sinon erreur
        res.status(200).json({ user, token });
        // res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
  };


// #region export
export{
    getUtilisateurById,
    createUtilisateur,
    createConnexionByUtilisateur
}