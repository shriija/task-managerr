import {ListModel} from '../models/List.js'

export const AddList = async(req,res) =>{
    const {title,board,position} = req.body;
    try {
        await ListModel.validate({title:title,board:board})
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