import { Router } from "express";
import { getAllUne, createUne } from "../controllers/uneControllers.js";

 const uneRoute = Router();
 uneRoute.route("/unes").get(getAllUne)
 uneRoute.route("/unes").post(createUne)

 export default uneRoute