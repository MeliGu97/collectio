import Favoris from "../models/Favoris.js";

 
// #region get All Favoris
const getAllFavoris = async (req, res) => {
    try {
      const favoris = await Favoris.find();
      res.json(favoris);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region get All Fav Utili
const getAllFavorisUtili = async (req, res) => {
    try {
      const favoris = await Favoris.find({ userId: req.params.userId }).populate({
        path: 'collectionIds',
        populate: {
          path: 'periodesId',
          options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
        }
      });
      res.json(favoris);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


// #region create Liste Fav
const createListeFavorisForOneUtili = async (req, res) => {
    try {
      const newFavoris = new Favoris({
        userId: req.body.userId,
        collectionIds: []
      });
  
      const favorisEnregistre = await newFavoris.save();
        res.status(201).json(favorisEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


// #region add fav
const addOneFavorisInListeUtili = async (req, res) => {
    try {
      const { userId } = req.params;
      const { collectionId } = req.body;
  
      // Trouver le favori correspondant à l'utilisateur connecté
      const favori = await Favoris.findOne({ userId });
  
      // Ajouter l'identifiant de collection au tableau collectionIds du favori
      favori.collectionIds.push(collectionId);
  
      // Enregistrer les modifications dans la base de données
      await favori.save();
  
      res.send({ message: 'Identifiant de collection ajouté avec succès' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  


// #region remove fav
const removeOneFavorisOfListeUtili = async (req, res) => {
    try {
      const { userId } = req.params;
      const { collectionId } = req.body;
  
      // Trouver le favori correspondant à l'utilisateur connecté
      const favori = await Favoris.findOne({ userId });
  
      // Vérifier si l'identifiant de collection est présent dans le tableau collectionIds du favori
      const index = favori.collectionIds.indexOf(collectionId);
      if (index !== -1) {
        // Retirer l'identifiant de collection du tableau collectionIds du favori
        favori.collectionIds.splice(index, 1);
  
        // Enregistrer les modifications dans la base de données
        await favori.save();
  
        res.send({ message: 'La collection a été retiré avec succès des favoris' });
      } else {
        res.status(404).send({ message: 'Identifiant de collection non trouvé' });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  

// #region Export
export {
    getAllFavoris,
    getAllFavorisUtili,

    createListeFavorisForOneUtili,
    addOneFavorisInListeUtili,
    removeOneFavorisOfListeUtili
}