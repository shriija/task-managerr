import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';

export const uploadAttachments = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Verify board membership
        const list = await ListModel.findById(card.list);
        if (!list) return res.status(404).json({ message: "List not found" });
        const board = await BoardModel.findById(list.board);
        if (!board) return res.status(404).json({ message: "Board not found" });

        const isOwner = board.owner.toString() === req.userId;
        const isAdmin = board.admins?.some(a => a.toString() === req.userId);
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Only board owners or admins can upload attachments" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const { default: cloudinary } = await import("../../config/cloudinary.js");

        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "task-manager/attachments",
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({
                            name: file.originalname,
                            url: result.secure_url,
                            type: file.mimetype,
                            size: file.size,
                            publicId: result.public_id,
                            uploadedBy: req.userId,
                            uploadedAt: new Date(),
                        });
                    }
                );
                stream.end(file.buffer);
            });
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        card.attachments.push(...uploadedFiles);
        await card.save();

        const updatedCard = await CardModel.findById(cardId)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate("attachments.uploadedBy", "name email avatar")
            .populate("remarks.author", "name email avatar")
            .populate("remarks.attachments.uploadedBy", "name email avatar");

        res.status(200).json({ message: "Files uploaded successfully", payload: updatedCard });
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
};
