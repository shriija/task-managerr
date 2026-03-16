import { CardModel } from "../models/Card.js";

const addCard=async(req,res)=>{
    const createCard = req.body;
    try{
        const newCard=new CardModel(createCard)
        const saveCard=await newCard.save();
        res.status(201).json({message:"New card addted successfullt", payload:saveCard})
    }
    catch(error){
        console.error("Error adding card:", error.message);
        res.status(500).json({ message: "Error adding card" });
    }
}