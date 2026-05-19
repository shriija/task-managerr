import exp from "express"
import { addCard, getCards, deleteCards, getCardById, updateCard, moveCard } from "../controllers/cardController.js";
import verifyToken from '../utils/verifyToken.js'
const CardApp=exp.Router()

//Add Cards
CardApp.post("/addCard", verifyToken, addCard)

//get cards
CardApp.get("/getCards/:id", verifyToken, getCards)

// get card by id
CardApp.get("/getCardById/:id", verifyToken, getCardById)

//Update card
CardApp.put("/updateCard/:id", verifyToken, updateCard)

//Move card (drag & drop)
CardApp.put("/moveCard/:id", verifyToken, moveCard)

//delete cards
CardApp.delete("/deleteCards/:id", verifyToken, deleteCards)

export default CardApp;
