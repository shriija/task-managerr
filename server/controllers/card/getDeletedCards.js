import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';

export const getDeletedCardsByBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const lists = await ListModel.find({ board: boardId });
        const listIds = lists.map(l => l._id);
        const deletedCards = await CardModel.find({ 
            list: { $in: listIds },
            isDeleted: true
        })
        .populate("assignedTo", "name email avatar")
        .populate("assignees", "name email avatar")
        .populate("createdBy", "name email avatar")
        res.status(200).json({ message: "Deleted cards fetched", payload: deletedCards })
    } catch (error) {
        res.status(500).json({ message: "Could not fetch deleted cards", error: error.message })
    }
}
