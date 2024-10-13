import { Router } from "express";
import { 
    getUtilisateurById,
    getCurrentUtilisateur,

    createUtilisateur,
    createConnexionByUtilisateur, 

    updateUtilisateur
 } from "../controllers/utilisateurControllers.js";
 import verifyToken from "../middleware/verify.js";

 const utilisateurRoute = Router();
 utilisateurRoute.route("/utilisateurs/:id").get(getUtilisateurById)
 utilisateurRoute.route("/currentUtilisateur").get(getCurrentUtilisateur)

 utilisateurRoute.route("/utilisateurs").post(createUtilisateur)
 utilisateurRoute.route("/login").post(createConnexionByUtilisateur)

//  ajouter le token
 utilisateurRoute.route("/utilisateurs/:id").put(updateUtilisateur)

 export default utilisateurRoute