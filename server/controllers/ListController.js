import {ListModel} from '../models/List.js'

export const AddList = async(req,res) =>{
    const listInfo = req.body;
    const {title,board,position} = req.body;
    console.log(title,board,position)
    try {
        await ListModel.validate(listInfo)
        console.log("safe 1")
        const list = new ListModel({
            title:title,
            board:board,
            position:position
        })
        console.log("safe2")
        list.save()
        res.status(201).json({message:"list created",payload:list})
    } catch (error) {
        console.log("error in addlist")
        res.json(500).json({error:error.message})
    }
}