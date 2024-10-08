import { Router } from "express";
import { 
    getAllFavoris,
    getAllFavorisUtili,

    createListeFavorisForOneUtili,
    addOneFavorisInListeUtili,
    removeOneFavorisOfListeUtili
} from "../controllers/favorisControllers.js";

const favorisRoute = Router();
favorisRoute.route("/favoris").get(getAllFavoris)
favorisRoute.route("/favorisUser/:userId").get(getAllFavorisUtili)

favorisRoute.route("/favoris").post(createListeFavorisForOneUtili)
favorisRoute.route("/favorisUser/:userId").patch(addOneFavorisInListeUtili)
favorisRoute.route("/favorisUserDelete/:userId").patch(removeOneFavorisOfListeUtili)

export default favorisRoute