import { BoardModel } from '../../models/Board.js'

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
