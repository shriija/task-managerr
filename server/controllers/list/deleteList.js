import {ListModel} from '../../models/List.js'
import { logActivity } from '../../utils/activityLogger.js'

export const deleteList = async(req,res) =>{
    try {
        const listId = req.params.id
        const response = await ListModel.findByIdAndUpdate(
            listId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        )
        if(!response){
            return res.status(404).json({message:"list not found"})
        }
        await logActivity(response.board, req.userId, `deleted list "${response.title}"`);
        res.status(200).json({message:"list deleted (soft delete)",payload:response})
    } catch (error) {
        res.status(500).json({message:"Could not delete list",error:error.message})
    }
}
