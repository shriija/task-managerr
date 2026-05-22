import { BoardModel } from '../../models/Board.js'

export const restoreBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const restored = await BoardModel.findByIdAndUpdate(
      boardId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    )
    if (!restored) {
      return res.status(404).json({ message: "Board not found" })
    }
    res.status(200).json({ message: "Board restored", payload: restored })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
