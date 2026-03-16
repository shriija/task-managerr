import exp from "express"
import { addCard } from "../controllers/cardController";
const CardApp=exp.Router()

CardApp.post("/addCard",addCard)

export default CardApp;
