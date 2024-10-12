import Une from "../models/Une.js";

// #region get All une
const getAllUne = async (req, res) => {
    try {
      const unes = await Une.find().populate({
        path: 'collectionId',
        populate: {
          path: 'periodesId'
        }
      });
      res.json(unes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };


//   #region create Une
const createUne = async (req, res) => {
    try {
      const nouvelUne = new Une({
        date: req.body.date,
        collectionId: req.body.collectionId,
      });
        const uneEnregistre = await nouvelUne.save();
        res.status(201).json(uneEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

// #region delete une
const deleteUne = async (req, res) => {
  try {
    const objectId = req.params.id;
    console.log('ObjectId:', objectId);
    const uneASupprimer = await Une.deleteOne({_id: objectId});
    console.log('Une:', uneASupprimer);

    if (uneASupprimer.deletedCount === 0) {
      return res.status(404).json({ message: 'une non trouvée' });
    }

    res.json({ message: 'Une supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la Une:', error);
    res.status(500).json({ message: error.message });
  }
};


//   #region export
export{ getAllUne, createUne, deleteUne }