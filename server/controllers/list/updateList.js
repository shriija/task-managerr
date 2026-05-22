import {ListModel} from '../../models/List.js'
import { logActivity } from '../../utils/activityLogger.js'

export const updateList = async(req,res) =>{
  const list=req.params.id
  const {title}=req.body
  try{
    const oldList = await ListModel.findById(list)
    const updatedList=await ListModel.findByIdAndUpdate(list,{title},{new:true})
    if (updatedList && oldList && oldList.title !== title) {
      await logActivity(updatedList.board, req.userId, `renamed list "${oldList.title}" to "${title}"`);
    }
    res.status(200).json({message:"List updated successfully",payload:updatedList})
  }catch(error){
    res.status(500).json({message:"Could not update list",error:error.message})
  }
}
