import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';

export const addRemark = async (req, res) => {
    try {
        const cardId = req.params.cardId;
        const { text } = req.body;
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Verify board membership
        const list = await ListModel.findById(card.list);
        if (!list) return res.status(404).json({ message: "List not found" });
        const board = await BoardModel.findById(list.board);
        if (!board) return res.status(404).json({ message: "Board not found" });

        const isMember = board.owner.toString() === req.userId
            || board.members.some(m => m.toString() === req.userId);
        if (!isMember) {
            return res.status(403).json({ message: "Only board members can add remarks" });
        }

        let remarkAttachments = [];
        if (req.files && req.files.length > 0) {
            const { default: cloudinary } = await import("../../config/cloudinary.js");
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "task-manager/remarks",
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
            remarkAttachments = await Promise.all(uploadPromises);
        }

        if (!text && remarkAttachments.length === 0) {
            return res.status(400).json({ message: "Remark must have text or attachments" });
        }

        card.remarks.push({
            text: text || "",
            attachments: remarkAttachments,
            author: req.userId,
        });
        await card.save();

        const updatedCard = await CardModel.findById(cardId)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate("attachments.uploadedBy", "name email avatar")
            .populate("remarks.author", "name email avatar")
            .populate("remarks.attachments.uploadedBy", "name email avatar");

        res.status(201).json({ message: "Remark added", payload: updatedCard });
    } catch (error) {
        res.status(500).json({ message: "Could not add remark", error: error.message });
    }
};
