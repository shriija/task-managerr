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
    const response = await ListModel.findByIdAndDelete(listId)
    if(!response){
    return res.status(404).json({message:"list not found"})
    }
    res.status(201).json({message:"list deleted",payload:response})
}
export const getList = async(req,res) =>{
    const listId = req.params.id;
    const response = await ListModel.findById(listId)
    if(!response){
        return res.status(404).json({message:"list not found"})
    }
    res.status(201).json({message:"list found",payload:response})
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