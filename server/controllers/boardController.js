import { BoardModel } from '../models/Board.js'
import { ListModel } from '../models/List.js'
import { CardModel } from '../models/Card.js'

export const addBoard = async (req, res) => {

  try {

    const { title } = req.body

    const board = await BoardModel.create({
      title,
      owner: req.userId   // ⭐ from auth middleware
    })

    res.status(201).json({
      message: "Board created",
      payload: board
    })

  } catch (error) {
    console.log("error in addBoard")
    res.status(500).json({ error: error.message })
  }

}


export const getBoard = async (req, res) => {

  try {

    const board = await BoardModel.findById(req.params.id)
    console.log(board)
    if (!board || board.length==0) {
      return res.status(404).json({ message: "Board not found" })
    }

    res.json({
      message: "Board fetched",
      payload: board
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}
export const deleteBoard = async(req,res) =>{
  try {
    const boardId = req.params.id;
    const response = await BoardModel.findByIdAndDelete(boardId)
    if(!response){
      return res.status(404).json({message:"board not found"})
    }
    
    // Find all lists for this board
    const lists = await ListModel.find({ board: boardId });
    const listIds = lists.map(list => list._id);
    
    // Cascade delete all cards in those lists
    await CardModel.deleteMany({ list: { $in: listIds } });
    
    // Cascade delete all lists for this board
    await ListModel.deleteMany({ board: boardId });
    
    res.status(200).json({message:"board deleted",payload:response})
  } catch (error) {
    res.status(500).json({message:"Could not delete board",error:error.message})
  }
}

export const getMyBoards = async (req, res) => {
  try {

    const boards = await BoardModel.find({
      owner: req.userId
    })

    res.json({
      message: "Boards fetched",
      payload: boards
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}