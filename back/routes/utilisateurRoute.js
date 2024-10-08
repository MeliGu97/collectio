import { Router } from "express";
import { 
    getUtilisateurById,

    createUtilisateur,
    createConnexionByUtilisateur
 } from "../controllers/utilisateurControllers.js";

 const utilisateurRoute = Router();
 utilisateurRoute.route("/utilisateurs/:id").get(getUtilisateurById)

 utilisateurRoute.route("/utilisateurs").post(createUtilisateur)
 utilisateurRoute.route("/login").post(createConnexionByUtilisateur)

 export default utilisateurRoute