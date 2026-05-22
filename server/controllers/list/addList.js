import {ListModel} from '../../models/List.js'
import { logActivity } from '../../utils/activityLogger.js'

export const AddList = async(req,res) =>{
    const listInfo = req.body;
    const {title,board,position} = req.body;
    try {
        await ListModel.validate(listInfo)

        const list = new ListModel({
            title:title,
            board:board,
            position:position
        })

        await list.save()
        await logActivity(board, req.userId, `created list "${title}"`);
        res.status(201).json({message:"list created",payload:list})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
