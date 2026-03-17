import { BoardModel } from '../models/Board.js'

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

    if (!board) {
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
  const boardId = req.params.id;
  const response = await BoardModel.findByIdAndDelete(boardId)
  if(!response){
    return res.status(404).json({message:"board not found"})
  }
  res.status(201).json({message:"board deleted",payload:response})
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