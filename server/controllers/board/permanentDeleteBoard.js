import { BoardModel } from '../../models/Board.js'
import { ListModel } from '../../models/List.js'
import { CardModel } from '../../models/Card.js'

export const permanentDeleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const board = await BoardModel.findByIdAndDelete(boardId);
    
    if (!board) {
      return res.status(404).json({ message: "Board not found" })
    }

    // Cascade hard delete
    const lists = await ListModel.find({ board: boardId })
    const listIds = lists.map(l => l._id)
    await CardModel.deleteMany({ list: { $in: listIds } })
    await ListModel.deleteMany({ board: boardId })

    res.status(200).json({ message: "Board permanently deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
