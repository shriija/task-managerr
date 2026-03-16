import {BoardModel} from '../models/Board.js'

export const addBoard = async(req,res) =>{
    const {title,owner,members} = req.body;
    try {
        const response = await BoardModel.validate({title:title,owner:owner});
        const board = new BoardModel({
            title:title,
            owner:owner,
            members:members
        });
        board.save()
        res.status(500).json({message:"board created"})
    } catch (error) {
        console.log("error in addBoard")
        res.status(401).json({error:error.message})
    }
    
    board.save()
}