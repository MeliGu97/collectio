import Signalement from "../models/Signalement.js";

// #region get All Signalements
const getAllSignalements = async (req, res) => {
    try {
      const signalements = await Signalement.find().populate({
        path: 'collectionId',
        populate: {
          path: 'periodesId'
        }
      });
      res.json(signalements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };


  // #region 
const getSignalementByCollId = async (req, res) => {
    try {
      const signalement = await Signalement.findOne({ collectionId: req.params.id });
      if (!signalement) {
        return res.status(404).json({ message: 'Signalement not found' });
      }
      res.json(signalement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // #region 
  const createSignalement = async (req, res) => {
    try {
      const newSignalement = new Signalement({
        description: req.body.description,
        collectionId: req.body.collectionId,
        date: req.body.date,
        reponseUtili: req.body.reponseUtili,
        reponseDate: req.body.reponseDate,
      });
        const SignalementEnregistre = await newSignalement.save();
        res.status(201).json(SignalementEnregistre);
        console.log("Alors signalemntEnre",SignalementEnregistre)
    } catch (error) {
      console.error(error);
        res.status(500).json({ message: error.message });
    }
    };


  // #region 
  const updateSignalement = async (req, res) => {
    try {
      const signalement = await Signalement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!signalement) {
        return res.status(404).json({ message: 'Signalement non trouvé' });
      }
      res.json(signalement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  // #region 
  const deleteSignalement = async (req, res) => {
    try {
      const objectId = req.params.id;
      console.log('ObjectId:', objectId);
      const result = await Signalement.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'signalement non trouvé' });
      }
  
      res.json({ message: 'signalement supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du signalement:', error);
      res.status(500).json({ message: error.message });
    }
  };



//   #region Export
export {
    getAllSignalements,
    getSignalementByCollId,

    createSignalement,
    updateSignalement,
    deleteSignalement,
}