import { BoardModel } from '../../models/Board.js'

export const getMyBoards = async (req, res) => {
  try {
    const boards = await BoardModel.find({
      owner: req.userId,
      isDeleted: { $ne: true }
    })

    res.json({ message: "Boards fetched", payload: boards })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
