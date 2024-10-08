import { Router } from "express";
import { 
    getAllEvenement,
    getEvenementById,

    createEvenement,
    updateEvenement,
    deleteEvenement,
 } from "../controllers/evenementControllers.js";

 const evenementRoute = Router();
// evenementRoute.route("/ROUTE").TYPEDEREQUETE(NOMDELAMETHODE)
evenementRoute.route("/evenements").get(getAllEvenement)
evenementRoute.route("/evenements/:id").get(getEvenementById)

evenementRoute.route("/evenements").post(createEvenement)
evenementRoute.route("/evenements/:id").put(updateEvenement)
evenementRoute.route("/evenements/:id").delete(deleteEvenement)


export default evenementRoute