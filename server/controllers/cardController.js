import { CardModel } from "../models/Card.js";

//Create Cards
export const addCard=async(req,res)=>{
    const createCard = req.body;
    if(createCard.dueDate){
        const date= new Date();
        const dueDate=new Date(createCard.dueDate);
        if(dueDate<date){
            return res.status(400).json({message:"Due date cannot be in the past",payload: createCard.dueDate} )
        }
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
        const cards=await CardModel.find({list:list}).sort({ position: 1 })
        res.status(200).json({message:"Cards fetched",payload:cards})
    }catch(error){
        res.status(500).json({message:"Could not fetch cards",error:error.message})
    }
}

//Update card
export const updateCard=async(req,res)=>{
    const cardId=req.params.id
    const {title, description, dueDate, priority}=req.body
    if(dueDate){
        const date= new Date();
        const due=new Date(dueDate);
        if(due<date){
            return res.status(400).json({message:"Due date cannot be in the past",payload:dueDate})
        }
    }
    try{
        const updateFields = { title, description }
        if (dueDate !== undefined) updateFields.dueDate = dueDate
        if (priority !== undefined) updateFields.priority = priority
        const updatedCard=await CardModel.findByIdAndUpdate(cardId, updateFields, {new:true})
        res.status(200).json({message:"Card updated successfully",payload:updatedCard})
    }catch(error){
        res.status(500).json({message:"Could not update card",error:error.message})
    }
}

//Move card (drag & drop)
export const moveCard=async(req,res)=>{
    const cardId=req.params.id
    const {toListId, newPosition}=req.body
    try{
        const cardToMove = await CardModel.findById(cardId);
        if (!cardToMove) {
            return res.status(404).json({ message: "Card not found" });
        }

        const oldListId = cardToMove.list.toString();

        // 1. Assign it to the new list temporarily so it gets fetched
        cardToMove.list = toListId;
        await cardToMove.save();

        // 2. Re-sequence the destination list
        const toListCards = await CardModel.find({ list: toListId }).sort({ position: 1 });
        const filteredCards = toListCards.filter(c => c._id.toString() !== cardId);
        
        // Insert the card at the exact target index
        filteredCards.splice(newPosition, 0, cardToMove);

        for (let i = 0; i < filteredCards.length; i++) {
            await CardModel.findByIdAndUpdate(filteredCards[i]._id, { position: i });
        }

        // 3. Re-sequence the old list if cross-list move
        if (oldListId !== toListId) {
            const oldListCards = await CardModel.find({ list: oldListId }).sort({ position: 1 });
            const filteredOld = oldListCards.filter(c => c._id.toString() !== cardId);
            for (let i = 0; i < filteredOld.length; i++) {
                await CardModel.findByIdAndUpdate(filteredOld[i]._id, { position: i });
            }
        }

        const updatedCard = await CardModel.findById(cardId);
        res.status(200).json({ message: "Card moved successfully", payload: updatedCard });
    }catch(error){
        console.error("Error moving card:", error)
        res.status(500).json({message:"Could not move card",error:error.message})
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

