import Collection from "../models/Collection.js";
import Element from "../models/Element.js"
import Evenement from "../models/Evenement.js";

// #region get all elem
const getAllElements = async (req, res) => {
    try {
      const elements = await Element.find();
      res.json(elements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region get One Element
const getElementById =async (req, res) => {
    try {
      const objectId = req.params.id; // L'ID est déjà dans le format attendu
      const elementCible = await Element.findById(objectId);
      if (!elementCible) {
        return res.status(404).json({ message: 'Élément non trouvé' });
      }
      //console.log("elementCibleeeeeeee : ", elementCible)
      res.json(elementCible);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    };
  

// #region ---
// #region Create elem
const createElement = async (req, res) => {
    //console.log(req)
    try {
      const nouvelElement = new Element({
        label: req.body.label,
        description: req.body.description,
        collectionsId: req.body.collectionsId,
        imageUrl: req.body.imageUrl,
      });
  
        //console.log("nouvel element :",nouvelElement);
        const elementEnregistre = await nouvelElement.save();
        await Collection.updateMany(
          { _id: { $in: req.body.collectionsId } },
          { $push: { elementsId: elementEnregistre._id } }
        );
        res.status(201).json(elementEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


// #region update Element
const updateElement = async (req, res) => {
    try {
      const updatedElement = await Element.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedElement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region delete Element
const deleteElement = async (req, res) => {
    try {
      const objectId = req.params.id;
      const elementASupprimer = await Element.findById(objectId);
  
      if (!elementASupprimer) {
        return res.status(404).json({ message: 'Élément non trouvé' });
      }
  
      // Récupérer les événements associés à l'élément
      const evenementsAssocies = await Evenement.find({ elementId: objectId });
  
      // Supprimer les événements associés à l'élément un par un
      for (const evenement of evenementsAssocies) {
        await Evenement.deleteOne({ _id: evenement._id });
      }
  
      // Supprimer l'ID de l'élément de la collection
      await Collection.updateMany(
        { elementsId: objectId },
        { $pull: { elementsId: objectId } }
      );
  
      // Supprimer l'élément de la base de données
      await Element.deleteOne({ _id: objectId });
  
      res.json({ message: 'Élément et événements associés supprimés avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément:', error);
      res.status(500).json({ message: error.message });
    }
  };


  //  #region export
export{
    getAllElements,
    getElementById,

    createElement,
    updateElement,
    deleteElement,
}