import exp from "express"
import { addCard, getCards, deleteCards } from "../controllers/cardController.js";
const CardApp=exp.Router()

//Add Cards
CardApp.post("/addCard",addCard)

//get cards
CardApp.get("/getCards/:id",getCards)

//delete cards
CardApp.delete("/deleteCard/:id",deleteCards)

export default CardApp;
