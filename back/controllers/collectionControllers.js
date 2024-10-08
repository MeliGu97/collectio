import Collection from "../models/Collection.js"
import Element from "../models/Element.js";
import Evenement from "../models/Evenement.js";


// #region get All Coll
const getAllCollections = async (req, res) => {
    try {
      //const collections = await Collection.find();
      //pour faire auto matcher les tables lors de la récupération des données
      //recupere un obj avec collection ET toutes les periodes associées
      const collections = await Collection.find().populate({
        path: 'periodesId',
        options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
      });
      //console.log("collectionsssss",collections);
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// #region get All Coll Public
const getAllCollectionsPublic = async (req, res) => {
    try {
      const query = { public: true };
      const collections = await Collection.find(query).populate({
        path: 'periodesId',
        options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
      });
      res.json(collections);
    } catch (error) {
      console.error('Erreur :', error);
      res.status(500).json({ message: error.message });
    }
  };


// #region ------
// #region get One Coll
  const getCollectionById = async (req, res) => {
    try {
      const collection = await Collection.findById(req.params.id).populate({
        path: 'periodesId',
        options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
      });
      if (!collection) {
        return res.status(404).json({ message: 'Collection non trouvée' });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region get Coll Public Utili
  const getCollectionsPublicUtiliByUserId = async (req, res) => {
    try {
      const collections = await Collection.find({ userId: req.params.userId,  public: true}).populate({
        path: 'periodesId',
        options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
      });
      res.json(collections);
    } catch (error) {
      console.error('Erreur :', error);
      res.status(500).json({ message: error.message });
    }
  };


  // #region get Coll Private Utili
  const getCollectionsPrivateUtiliByUserId = async (req, res) => {
    console.log(req.user)
    try {
      const collections = await Collection.find({ userId: req.user._id, public: false}).populate({
        path: 'periodesId',
        options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
      });
      res.json(collections);
    } catch (error) {
      console.error('Erreur :', error);
      res.status(500).json({ message: error.message });
    }
  };


// #region ------
// #region create coll
const createCollection = async (req, res) => {
    console.log("req : ", req)
    try {
      const newCollection = new Collection({
        label: req.body.label,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        picto: req.body.picto,
        categorie: req.body.categorie,
        sousCategorie: req.body.sousCategorie,
        elementsId: req.body.elementsId,
        periodesId: req.body.periodesId,
        public: req.body.public,
        userId: req.body.userId,
        signalement: req.body.public,
      });
        const collectionEnregistre = await newCollection.save();
        res.status(201).json(collectionEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


// #region update coll
const updateCollection = async (req, res) => {
    try {
      const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!collection) {
        return res.status(404).json({ message: 'Collection non trouvée' });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region delete Coll
// pour supprimer en cascade une collection 
const deleteCollection =async (req, res) => {
    try {
      const objectId = req.params.id;
      const collectionASupprimer = await Collection.findById(objectId);
  
      if (!collectionASupprimer) {
        return res.status(404).json({ message: 'Collection non trouvée' });
      }
  
      // Supprimer les éléments associés à la collection
      for (const elementId of collectionASupprimer.elementsId) {
        // Récupérer les événements associés à l'élément
        const evenementsAssocies = await Evenement.find({ elementId: elementId });
  
        // Supprimer les événements associés à l'élément un par un
        for (const evenement of evenementsAssocies) {
          await Evenement.deleteOne({ _id: evenement._id });
        }
  
        // Supprimer l'élément de la base de données
        await Element.deleteOne({ _id: elementId });
      }
  
      // Supprimer la collection de la base de données
      await Collection.deleteOne({ _id: objectId });
  
      res.json({ message: 'Collection et éléments associés supprimés avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la collection:', error);
      res.status(500).json({ message: error.message });
    }
  };


//  #region export
// On reporte ici tous les noms des methodes que l'on veut utiliser 
  export {
    getAllCollections,
    getCollectionById,
    getCollectionsPublicUtiliByUserId,
    getCollectionsPrivateUtiliByUserId,
    getAllCollectionsPublic,

    createCollection,
    updateCollection,
    deleteCollection
  }