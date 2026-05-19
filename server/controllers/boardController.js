import { BoardModel } from '../models/Board.js'
import { ListModel } from '../models/List.js'
import { CardModel } from '../models/Card.js'

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
      {
        title: "To Do",
        board: board._id,
        position: 0
      },
      {
        title: "In Progress",
        board: board._id,
        position: 1
      },
      {
        title: "Done",
        board: board._id,
        position: 2
      }
    ])

    res.status(201).json({
      message: "Board created",
      payload: board
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })
  }
}


export const getBoard = async (req, res) => {

  try {

    const board = await BoardModel.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")

    if (!board || board.length == 0) {

      return res.status(404).json({
        message: "Board not found"
      })
    }

    res.json({
      message: "Board fetched",
      payload: board
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })
  }

}


export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id

    const response = await BoardModel.findByIdAndUpdate(
      boardId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    )

    if (!response) {
      return res.status(404).json({
        message: "board not found"
      })
    }

    res.status(200).json({
      message: "board deleted (soft delete)",
      payload: response
    })

  } catch (error) {
    res.status(500).json({
      message: "Could not delete board",
      error: error.message
    })
  }
}


export const getMyBoards = async (req, res) => {
  try {
    const boards = await BoardModel.find({
      owner: req.userId,
      isDeleted: { $ne: true }
    })

    res.json({
      message: "Boards fetched",
      payload: boards
    })

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

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

export const updateBoard = async (req, res) => {
  try {
    const board = await BoardModel.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can update settings" });
    }
    
    const { title, allowMultipleAssignees } = req.body;
    if (title !== undefined) board.title = title;
    if (allowMultipleAssignees !== undefined) board.allowMultipleAssignees = allowMultipleAssignees;
    
    await board.save();
    
    const updated = await BoardModel.findById(board._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");
      
    res.json({ message: "Board updated successfully", payload: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getSharedBoards = async (req, res) => {
  try {
    const boards = await BoardModel.find({
      owner: { $ne: req.userId },
      members: req.userId,
      isDeleted: { $ne: true }
    }).populate("owner", "name email avatar");
    res.status(200).json({ message: "Shared boards fetched", payload: boards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}