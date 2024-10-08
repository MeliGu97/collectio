import Evenement from "../models/Evenement.js"


// #region get all event
const getAllEvenement = async (req, res) => {
    try {
      const elementId = req.query.elementId;
      if (!elementId) {
        return res.status(400).json({ message: 'elementId est requis' });
      }
      const evenements = await Evenement.find({ elementId });
      res.json(evenements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region get One event
const getEvenementById =async (req, res) => {
    try {
      const objectId = req.params.id;
      const evenementCible = await Evenement.findById(objectId);
      if (!evenementCible) {
        return res.status(404).json({ message: 'Evenement non trouvé' });
      }
      res.json(evenementCible);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region ---
// #region Create event
const createEvenement = async (req, res) => {
    try {
      const nouvelEvenement = new Evenement({
        label: req.body.label,
        jour: req.body.jour,
        mois: req.body.mois,
        annee: req.body.annee,
        heure: req.body.heure,
        minute: req.body.minute,
        date: req.body.date,
        detail: req.body.detail,
        elementId: req.body.elementId,
      });
        const evenementEnregistre = await nouvelEvenement.save();
        res.status(201).json(evenementEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


// #region update event
const updateEvenement = async (req, res) => {
    try {
      const updatedEvenement = await Evenement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedEvenement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// #region delete event
const deleteEvenement = async (req, res) => {
    try {
      const objectId = req.params.id;
      const result = await Evenement.deleteOne({ _id: objectId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Événement non trouvé' });
      }
  
      res.json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      res.status(500).json({ message: error.message });
    }
  };

  
  //  #region export
  export {
    getAllEvenement,
    getEvenementById,

    createEvenement,
    updateEvenement,
    deleteEvenement,
  }