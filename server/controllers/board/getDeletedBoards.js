import { BoardModel } from '../../models/Board.js'

export const getDeletedBoards = async (req, res) => {
  try {
    const boards = await BoardModel.find({
      owner: req.userId,
      isDeleted: true
    })
    res.status(200).json({ message: "Deleted boards fetched", payload: boards })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
