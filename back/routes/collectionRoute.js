import { Router } from "express";

// Ici on fait la liste de toute les methodes qu'il faut importer depuis
import { 
    getAllCollections, 
    getAllCollectionsPublic,

    getCollectionById, 
    getCollectionsPublicUtiliByUserId,
    getCollectionsPrivateUtiliByUserId,

    createCollection,
    updateCollection,
    deleteCollection
} from "../controllers/collectionControllers.js";
// C'est la que l'on vient ajouter le fichier verify pour la sécu
import verifyToken from "../middleware/verify.js";


const collectionRoute = Router();
// On précise les routes de chaque (methode) ici
// collectionRoute.route("/ROUTE").TYPEDEREQUETE(NOMDELAMETHODE)
collectionRoute.route("/collections").get(getAllCollections)
collectionRoute.route("/collectionsPublic").get(getAllCollectionsPublic)

collectionRoute.route("/collections/:id").get(getCollectionById)
collectionRoute.route("/collectionsPublicByUtili/user/:userId").get(getCollectionsPublicUtiliByUserId)
// On ajoute verufyToken apres la route
collectionRoute.route("/collectionsPrivateByUtili/user/:userId").get(verifyToken, getCollectionsPrivateUtiliByUserId)

collectionRoute.route("/collections").post(createCollection)
collectionRoute.route("/collections/:id").put(updateCollection)
collectionRoute.route("/collections/:id").delete(verifyToken, deleteCollection)

export default collectionRoute