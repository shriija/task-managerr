import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';
import { logActivity } from '../../utils/activityLogger.js';

export const restoreCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        const list = await ListModel.findById(card.list);
        if (list) {
            const board = await BoardModel.findById(list.board);
            if (board) {
                const isOwner = board.owner.toString() === req.userId;
                const isAdmin = board.admins?.some(a => a.toString() === req.userId);
                if (!isOwner && !isAdmin) {
                    return res.status(403).json({ message: "Only board owners or admins can restore tasks" });
                }
            }
        }
        const restoredCard = await CardModel.findByIdAndUpdate(
            cardId,
            { isDeleted: false, deletedAt: null },
            { new: true }
        )
        .populate("assignedTo", "name email avatar")
        .populate("assignees", "name email avatar")
        .populate("createdBy", "name email avatar")

        if (restoredCard) {
            if (list) {
                await logActivity(list.board, req.userId, `restored task "${restoredCard.title}"`);
            }
            // Auto-restore parent list if it was also deleted
            const parentList = await ListModel.findById(restoredCard.list);
            if (parentList && parentList.isDeleted) {
                await ListModel.findByIdAndUpdate(parentList._id, { isDeleted: false, deletedAt: null });
            }
            res.status(200).json({ message: "Card restored successfully", payload: restoredCard })
        } else {
            res.status(404).json({ message: "Card not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Could not restore card", error: error.message })
    }
}
