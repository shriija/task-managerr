import { BoardModel } from '../../models/Board.js'

export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id

    const response = await BoardModel.findByIdAndUpdate(
      boardId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    )

    if (!response) {
      return res.status(404).json({ message: "board not found" })
    }

    res.status(200).json({
      message: "board deleted (soft delete)",
      payload: response
    })
  } catch (error) {
    res.status(500).json({ message: "Could not delete board", error: error.message })
  }
}
