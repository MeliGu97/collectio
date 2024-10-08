import { Router } from "express";
import { 
    getAllPeriode,
    getPeriodeById, 

    // createPeriode
} from "../controllers/periodeControllers.js";


const periodeRoute = Router();
periodeRoute.route("/periodes").get(getAllPeriode)
periodeRoute.route("/periodes/:id").get(getPeriodeById)

// periodeRoute.route("/periodes").post(createPeriode)


export default periodeRoute