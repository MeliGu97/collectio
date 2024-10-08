import { Router } from "express";
import { 
    getAllElements,
    getElementById,

    createElement,
    updateElement,
    deleteElement,
} from "../controllers/elementControllers.js"; 
// import verifyToken from "../middleware/verify.js";
import verifyToken from "../middleware/verify.js";

const elementRoute = Router();
// elementRoute.route("/ROUTE").TYPEDEREQUETE(NOMDELAMETHODE)
elementRoute.route("/elements").get(getAllElements)
elementRoute.route("/elements/:id").get(getElementById)

elementRoute.route("/elements").post(verifyToken, createElement)
elementRoute.route("/elements/:id").put(verifyToken, updateElement)
elementRoute.route("/elements/:id").delete(verifyToken, deleteElement)

export default elementRoute