import exp from "express"
import { addCard, getCards, deleteCards, getCardById, updateCard, moveCard, getDeletedCardsByBoard, restoreCard, permanentDeleteCard, uploadAttachments, deleteAttachment, addRemark, deleteRemark } from "../controllers/card/index.js";
import verifyToken from '../utils/verifyToken.js'
import { uploadFiles } from '../utils/upload/index.js'
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

// Trash routes
CardApp.get("/trash/deleted/:boardId", verifyToken, getDeletedCardsByBoard)
CardApp.put("/restore/:id", verifyToken, restoreCard)
CardApp.delete("/permanent/:id", verifyToken, permanentDeleteCard)

// Attachment routes
CardApp.post("/attachments/:cardId", verifyToken, uploadFiles, uploadAttachments)
CardApp.delete("/attachments/:cardId/:attachmentId", verifyToken, deleteAttachment)

// Remark routes
CardApp.post("/remarks/:cardId", verifyToken, uploadFiles, addRemark)
CardApp.delete("/remarks/:cardId/:remarkId", verifyToken, deleteRemark)

export default CardApp;

