import {ListModel} from '../models/List.js'

export const AddList = async(req,res) =>{
    const listInfo = req.body;
    const {title,board,position} = req.body;
    console.log(title,board,position)
    try {
        await ListModel.validate(listInfo)

        const list = new ListModel({
            title:title,
            board:board,
            position:position
        })

        list.save()
        res.status(201).json({message:"list created",payload:list})
    } catch (error) {
        console.log("error in addlist")
        res.json(500).json({error:error.message})
    }
}
export const deleteList = async(req,res) =>{
    const listId = req.params.id
    const response = ListModel.findByIdAndDelete(listId)
    if(!response){
    return res.status(404).json({message:"list not found"})
    }
    res.status(201).json({message:"list deleted",payload:response})
}
export const getList = async(req,res) =>{
    const BoardId = req.params.id;
    const response = ListModel.find(BoardId)
    if(!response){
        return res.status(404).json({message:"no lists found"})
    }
    res.status(201).json({message:"lists found for board",payload:response})
}