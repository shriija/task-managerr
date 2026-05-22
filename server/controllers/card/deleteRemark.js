import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';

export const deleteRemark = async (req, res) => {
    try {
        const { cardId, remarkId } = req.params;
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const remark = card.remarks.id(remarkId);
        if (!remark) {
            return res.status(404).json({ message: "Remark not found" });
        }

        // Only the remark author or board owner/admin can delete
        const list = await ListModel.findById(card.list);
        const board = list ? await BoardModel.findById(list.board) : null;
        const isOwner = board?.owner.toString() === req.userId;
        const isAdmin = board?.admins?.some(a => a.toString() === req.userId);
        const isAuthor = remark.author.toString() === req.userId;

        if (!isOwner && !isAdmin && !isAuthor) {
            return res.status(403).json({ message: "You can only delete your own remarks" });
        }

        // Cleanup Cloudinary files for the remark
        if (remark.attachments && remark.attachments.length > 0) {
            try {
                const { default: cloudinary } = await import("../../config/cloudinary.js");
                for (const att of remark.attachments) {
                    if (att.publicId) {
                        await cloudinary.uploader.destroy(att.publicId, { resource_type: "raw" }).catch(() => {});
                    }
                }
            } catch (e) { /* best-effort cleanup */ }
        }

        card.remarks.pull(remarkId);
        await card.save();

        const updatedCard = await CardModel.findById(cardId)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate("attachments.uploadedBy", "name email avatar")
            .populate("remarks.author", "name email avatar")
            .populate("remarks.attachments.uploadedBy", "name email avatar");

        res.status(200).json({ message: "Remark deleted", payload: updatedCard });
    } catch (error) {
        res.status(500).json({ message: "Could not delete remark", error: error.message });
    }
};
