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
        order: req.body.order,
        collectionId: req.body.collectionsId,
      });
        const uneEnregistre = await nouvelUne.save();
        res.status(201).json(uneEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

//   #region export
export{ getAllUne, createUne }