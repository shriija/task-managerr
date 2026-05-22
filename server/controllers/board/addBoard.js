import { BoardModel } from '../../models/Board.js'
import { ListModel } from '../../models/List.js'

export const addBoard = async (req, res) => {
  try {
    const { title } = req.body

    // Create board
    const board = await BoardModel.create({
      title,
      owner: req.userId
    })

    // Create default lists
    await ListModel.insertMany([
      { title: "To Do", board: board._id, position: 0 },
      { title: "In Progress", board: board._id, position: 1 },
      { title: "Done", board: board._id, position: 2 }
    ])

    res.status(201).json({
      message: "Board created",
      payload: board
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
