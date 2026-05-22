import {ListModel} from '../../models/List.js'

export const getListsByBoard = async (req, res) => {
  try {

    const lists = await ListModel.find({
      board: req.params.boardId,
      isDeleted: { $ne: true }
    }).sort({ position: 1 })

    res.json({
      message: "Lists fetched",
      payload: lists
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
