import { CardModel } from '../../models/Card.js';

export const getCardById=async(req,res)=>{
    const getCard=req.params.id;
    try{
        const card=await CardModel.findById(getCard)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
        if(card){res.status(200).json({message:"Card fetched successfully",payload:card})}
        else{res.status(404).json({message:"Card not found"})}
    }catch(error){
        res.status(500).json({message:"Could not fetch card",error:error.message})
    }
}
