import {ListModel} from '../models/List.js'
import { CardModel } from '../models/Card.js'

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

        await list.save()
        res.status(201).json({message:"list created",payload:list})
    } catch (error) {
        console.log("error in addlist")
        res.status(500).json({error:error.message})
    }
}
export const deleteList = async(req,res) =>{
    try {
        const listId = req.params.id
        const response = await ListModel.findByIdAndDelete(listId)
        if(!response){
            return res.status(404).json({message:"list not found"})
        }
        
        // Cascade delete all cards in this list
        await CardModel.deleteMany({ list: listId })
        
        res.status(200).json({message:"list deleted",payload:response})
    } catch (error) {
        res.status(500).json({message:"Could not delete list",error:error.message})
    }
}
export const getList = async(req,res) =>{
    try {
        const listId = req.params.id;
        const response = await ListModel.findById(listId)
        if(!response){
            return res.status(404).json({message:"list not found"})
        }
        res.status(200).json({message:"list found",payload:response})
    } catch (error) {
        res.status(500).json({message:"Could not fetch list",error:error.message})
    }
}
export const getListsByBoard = async (req, res) => {
  try {

    const lists = await ListModel.find({
      board: req.params.boardId
    }).sort({ position: 1 })

    res.json({
      message: "Lists fetched",
      payload: lists
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


//Change list name
export const updateList = async(req,res) =>{
  const list=req.params.id
  const {title}=req.body
  try{
    const updatedList=await ListModel.findByIdAndUpdate(list,{title},{new:true})
    res.status(200).json({message:"List updated successfully",payload:updatedList})
  }catch(error){
    res.status(500).json({message:"Could not update list",error:error.message})
  }
}