import { Router } from "express";
import { getAllUne, createUne, deleteUne } from "../controllers/uneControllers.js";

 const uneRoute = Router();
 uneRoute.route("/unes").get(getAllUne)
 uneRoute.route("/unes").post(createUne)
 uneRoute.route("/unes/:id").delete(deleteUne)

 export default uneRoute