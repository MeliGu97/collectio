import { Router } from "express";

import { 
    getAllSignalements,
    getSignalementByCollId,

    createSignalement,
    updateSignalement,
    deleteSignalement,
} from "../controllers/signalementControllers.js";

const signalementRoute = Router();
signalementRoute.route("/signalements").get(getAllSignalements)
signalementRoute.route("/signalementCollection/:id").get(getSignalementByCollId)

signalementRoute.route("/signalements").post(createSignalement)
signalementRoute.route("/signalementCollection/:id").put(updateSignalement)
signalementRoute.route("/signalementCollection/:id").delete(deleteSignalement)

export default signalementRoute