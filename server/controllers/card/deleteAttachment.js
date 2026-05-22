import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';

export const deleteAttachment = async (req, res) => {
    try {
        const { cardId, attachmentId } = req.params;
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const list = await ListModel.findById(card.list);
        if (!list) return res.status(404).json({ message: "List not found" });
        const board = await BoardModel.findById(list.board);
        if (!board) return res.status(404).json({ message: "Board not found" });

        const isOwner = board.owner.toString() === req.userId;
        const isAdmin = board.admins?.some(a => a.toString() === req.userId);
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Only board owners or admins can delete attachments" });
        }

        const attachment = card.attachments.id(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: "Attachment not found" });
        }

        // Delete from Cloudinary if publicId exists
        if (attachment.publicId) {
            try {
                const { default: cloudinary } = await import("../../config/cloudinary.js");
                await cloudinary.uploader.destroy(attachment.publicId, { resource_type: "raw" });
            } catch (e) { /* Cloudinary cleanup is best-effort */ }
        }

        card.attachments.pull(attachmentId);
        await card.save();

        const updatedCard = await CardModel.findById(cardId)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate("attachments.uploadedBy", "name email avatar")
            .populate("remarks.author", "name email avatar")
            .populate("remarks.attachments.uploadedBy", "name email avatar");

        res.status(200).json({ message: "Attachment deleted", payload: updatedCard });
    } catch (error) {
        res.status(500).json({ message: "Could not delete attachment", error: error.message });
    }
};
