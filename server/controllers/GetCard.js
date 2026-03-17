import { CardModel } from "../models/Card";

export const getCards=async(req,res)=>{
    const list=req.params.id
    try{
        const cards=await CardModel.find({list:list})
        res.status(200).json({message:"Cards fetched",payload:cards})
    }catch(error){
        res.status(500).json({message:"Could not fetch cards",error:error.message})
    }
}