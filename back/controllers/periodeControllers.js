import Periode from "../models/Periode.js";


// #region get All Periode
const getAllPeriode = async (req, res) => {
    try {
      const periodes = await Periode.find();
      res.json(periodes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    };


// #region get one Periode
const getPeriodeById = async (req, res) => {
    try {
      const objectId = req.params.id; // L'ID est déjà dans le format attendu
      const periodeCible = await Periode.findById(objectId);
      if (!periodeCible) {
        return res.status(404).json({ message: 'Periode non trouvée' });
      }
      res.json(periodeCible);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


// #region ---
// #region create Periode
const createPeriode = async (req, res) => {
    try {
      const nouvelPeriode = new Periode({
        label: req.body.label,
        dateEvents: req.body.dateEvent,
        collectionsId: req.body.collectionsId,
      });
        const periodeEnregistre = await nouvelPeriode.save();
        res.status(201).json(periodeEnregistre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };


//  #region export
export{
    getAllPeriode,
    getPeriodeById,

    // createPeriode,
}