import { BoardModel } from '../../models/Board.js'

export const getBoard = async (req, res) => {
  try {
    const board = await BoardModel.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("admins", "name email avatar")

    if (!board || board.length == 0) {
      return res.status(404).json({ message: "Board not found" })
    }

    res.json({ message: "Board fetched", payload: board })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
