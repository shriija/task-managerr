import {ListModel} from '../../models/List.js'

export const getList = async(req,res) =>{
    try {
        const listId = req.params.id;
        const response = await ListModel.findOne({ _id: listId, isDeleted: { $ne: true } })
        if(!response){
            return res.status(404).json({message:"list not found"})
        }
        res.status(200).json({message:"list found",payload:response})
    } catch (error) {
        res.status(500).json({message:"Could not fetch list",error:error.message})
    }
}
