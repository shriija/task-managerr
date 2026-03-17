import { CardModel } from "../models/Card.js";

//Create Cards
export const addCard=async(req,res)=>{
    const createCard = req.body;
    try{
        const newCard=new CardModel(createCard)
        const saveCard=await newCard.save();
        res.status(201).json({message:"New card added successfully", payload:saveCard})
    }
    catch(error){
        console.error("Error adding card:", error.message);
        res.status(500).json({ message: "Error adding card" });
    }
}

//Fetch Cards
export const getCards=async(req,res)=>{
    const list=req.params.id
    try{
        const cards=await CardModel.find({list:list})
        res.status(200).json({message:"Cards fetched",payload:cards})
    }catch(error){
        res.status(500).json({message:"Could not fetch cards",error:error.message})
    }
}

//Delete Cards
export const deleteCards=async(req,res)=>{
    const cardId=req.params.id
    try{
        const deleteCard=await CardModel.findByIdAndDelete(cardId)
        if(deleteCard){
            res.status(200).json({message:"Card deleted successfully",payload:deleteCard})
        }
        else{
            res.status(404).json({message:"Card not found"})
        }
    }catch(error){
        res.ststus(500).json({message:"Could not delete card",error:error.message})
    }
}
