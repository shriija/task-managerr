import exp from "express"
import { addCard, getCards } from "../controllers/cardController.js";
const CardApp=exp.Router()

//Add Cards
CardApp.post("/addCard",addCard)

//get cards
CardApp.get("/getCards/:id",getCards)

//delete cards

export default CardApp;
