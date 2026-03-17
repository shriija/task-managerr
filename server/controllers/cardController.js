import { CardModel } from "../models/Card.js";
import Date from "date-and-time";

//Create Cards
export const addCard=async(req,res)=>{
    const createCard = req.body;
    const date= new Date();
    const dueDate=new Date(createCard.dueDate);
    if(dueDate<date){
        return res.status(400).json({message:"Due date cannot be in the past",payload: createCard.dueDate} )
        
    }
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

//Get card by id
export const getCardById=async(req,res)=>{
    const getCard=req.params.id;
    try{
        const card=await CardModel.findById(getCard)
        if(card){res.status(200).json({message:"Card fetched successfully",payload:card})}
        else{res.status(404).json({message:"Card not found"})}
    }catch(error){
        res.status(500).json({message:"Could not fetch card",error:error.message})
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

//Update card
export const updateCard=async(req,res)=>{
    const cardId=req.params.id
    const {title, description, dueDate}=req.body
    const date= new Date();
    const due=new Date(dueDate);
    if(due<date){
        return res.status(400).json({message:"Due date cannot be in the past",payload:dueDate})
        
    }
    try{
        const updatedCard=await CardModel.findByIdAndUpdate(cardId,{title, description, dueDate},{new:true})
        res.status(200).json({message:"Card updated successfully",payload:updatedCard})
    }catch(error){
        res.status(500).json({message:"Could not update card",error:error.message})
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
        res.status(500).json({message:"Could not delete card",error:error.message})
    }
}
