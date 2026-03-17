import exp from "express"
import { addCard, getCards, deleteCards, getCardById } from "../controllers/cardController.js";
const CardApp=exp.Router()

//Add Cards
CardApp.post("/addCard",addCard)

//get cards
CardApp.get("/getCards/:id",getCards)

// get card by id
CardApp.get("/getCardById/:id",getCardById)

//delete cards
CardApp.delete("/deleteCard/:id",deleteCards)

export default CardApp;
