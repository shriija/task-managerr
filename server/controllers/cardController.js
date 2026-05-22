import { CardModel } from "../models/Card.js";
import { ListModel } from "../models/List.js";
import { BoardModel } from "../models/Board.js";
import { UserModel } from "../models/User.js";
import { logActivity } from "../utils/activityLogger.js";

// Helper to parse date string in local timezone to avoid timezone shifting
const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const cleanStr = typeof dateStr === "string" ? dateStr.split("T")[0] : dateStr;
    const parts = cleanStr.toString().split("-");
    if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(dateStr);
};

/**
 * Create a New Task Card
 * Validates due dates, determines initial status based on the target list,
 * auto-assigns the creator to the board if they aren't a member, and logs the activity.
 * 
 * @param {Object} req - Express request object containing card details (title, list, dueDate, etc.)
 * @param {Object} res - Express response object
 */
export const addCard=async(req,res)=>{
    const createCard = req.body;
    if(createCard.dueDate){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = parseLocalDate(createCard.dueDate);
        due.setHours(0, 0, 0, 0);
        if(due < today){
            return res.status(400).json({message:"Due date cannot be in the past",payload: createCard.dueDate} )
        }
    }
    try{
        let initialStatus = "to do";
        const list = await ListModel.findById(createCard.list);
        if (list) {
            const board = await BoardModel.findById(list.board);
            if (board) {
                const isOwner = board.owner.toString() === req.userId;
                const isAdmin = board.admins?.some(a => a.toString() === req.userId);
                if (!isOwner && !isAdmin) {
                    if (createCard.assignedTo && createCard.assignedTo.toString() !== req.userId) {
                        return res.status(403).json({ message: "Only board owners or admins can assign tasks to other users" });
                    }
                    if (createCard.assignees && Array.isArray(createCard.assignees)) {
                        const assigningOthers = createCard.assignees.some(a => a.toString() !== req.userId);
                        if (assigningOthers) {
                            return res.status(403).json({ message: "Only board owners or admins can assign tasks to other users" });
                        }
                    }
                }
            }
            const title = list.title.toLowerCase();
            if (title === "to do") {
                initialStatus = "to do";
            } else if (title === "in progress") {
                initialStatus = "in progress";
            } else if (title === "done" || title === "completed") {
                initialStatus = "completed";
            }
        }

        const assignedUserId = createCard.assignedTo || req.userId;
        const newCard = new CardModel({
            ...createCard,
            createdBy: req.userId,
            assignedTo: assignedUserId,
            assignees: createCard.assignees || [],
            status: createCard.status || initialStatus
        })
        let saveCard = await newCard.save();

        // Auto-join creator and assignee to board members if they aren't owner or already a member
        if (list) {
            const board = await BoardModel.findById(list.board);
            if (board) {
                const checkAndAdd = async (userId) => {
                    if (!userId) return;
                    const isOwner = board.owner.toString() === userId.toString();
                    const isMember = board.members.some(m => m.toString() === userId.toString());
                    if (!isOwner && !isMember) {
                        board.members.push(userId);
                        await board.save();
                    }
                };
                await checkAndAdd(req.userId);
                if (assignedUserId && assignedUserId.toString() !== req.userId.toString()) {
                    await checkAndAdd(assignedUserId);
                }
                if (createCard.assignees && Array.isArray(createCard.assignees)) {
                    for (const assignee of createCard.assignees) {
                        if (assignee.toString() !== req.userId.toString()) {
                            await checkAndAdd(assignee);
                        }
                    }
                }
            }
        }

        saveCard = await CardModel.findById(saveCard._id)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar");

        if (list) {
            await logActivity(list.board, req.userId, `created task "${saveCard.title}"`);
        }

        res.status(201).json({message:"New card added successfully", payload:saveCard})
    }
    catch(error){
        res.status(500).json({ message: "Error adding card" });
    }
}

/**
 * Fetch details of a single Card by its ID
 * Populates the assigned user, multiple assignees, and the creator with user details.
 */
export const getCardById=async(req,res)=>{
    const getCard=req.params.id;
    try{
        const card=await CardModel.findById(getCard)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
        if(card){res.status(200).json({message:"Card fetched successfully",payload:card})}
        else{res.status(404).json({message:"Card not found"})}
    }catch(error){
        res.status(500).json({message:"Could not fetch card",error:error.message})
    }
}

/**
 * Fetch all active Cards for a specific List
 * Returns them sorted vertically by their `position` property.
 */
export const getCards=async(req,res)=>{
    const list=req.params.id
    try{
        const cards=await CardModel.find({list:list, isDeleted: { $ne: true }})
            .sort({ position: 1 })
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")
        res.status(200).json({message:"Cards fetched",payload:cards})
    }catch(error){
        res.status(500).json({message:"Could not fetch cards",error:error.message})
    }
}

/**
 * Update Card Details (Title, Description, Status, Priority, Due Date, Assignees)
 * Contains extensive permission checks: only owners/admins can change core details.
 * Regular members can only change the status (e.g., from "To Do" to "Done").
 * Logs all specific changes to the board's activity history.
 */
export const updateCard=async(req,res)=>{
    const cardId=req.params.id
    const {title, description, dueDate, priority, status, assignedTo, assignees}=req.body
    try{
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({message:"Card not found"})
        }

        if(dueDate){
            const currentDueTime = card.dueDate ? parseLocalDate(card.dueDate).setHours(0, 0, 0, 0) : null;
            const newDueTime = parseLocalDate(dueDate).setHours(0, 0, 0, 0);
            
            if (newDueTime !== currentDueTime) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if(newDueTime < today.getTime()){
                    return res.status(400).json({message:"Due date cannot be in the past",payload:dueDate})
                }
            }
        }

        // Check task assignment permissions
        const list = await ListModel.findById(card.list);
        if (list) {
            const board = await BoardModel.findById(list.board);
            if (board) {
                const isOwner = board.owner.toString() === req.userId;
                const isAdmin = board.admins?.some(a => a.toString() === req.userId);

                if (!isOwner && !isAdmin) {
                    const isTitleChanged = title !== undefined && title !== card.title;
                    const isDescriptionChanged = description !== undefined && description !== card.description;
                    const isDueDateChanged = dueDate !== undefined && (
                        (dueDate && !card.dueDate) ||
                        (!dueDate && card.dueDate) ||
                        (dueDate && card.dueDate && new Date(dueDate).getTime() !== new Date(card.dueDate).getTime())
                    );
                    const isPriorityChanged = priority !== undefined && priority !== card.priority;
                    
                    let isAssignedToChanged = false;
                    if (assignedTo !== undefined) {
                        const currentAssignedTo = card.assignedTo ? card.assignedTo.toString() : null;
                        const newAssignedTo = assignedTo ? assignedTo.toString() : null;
                        if (currentAssignedTo !== newAssignedTo) {
                            isAssignedToChanged = true;
                        }
                    }

                    let isAssigneesChanged = false;
                    if (assignees !== undefined) {
                        const currentAssignees = (card.assignees || []).map(a => a.toString()).sort();
                        const newAssignees = (assignees || []).map(a => a.toString()).sort();
                        if (JSON.stringify(currentAssignees) !== JSON.stringify(newAssignees)) {
                            isAssigneesChanged = true;
                        }
                    }

                    if (isTitleChanged || isDescriptionChanged || isDueDateChanged || isPriorityChanged || isAssignedToChanged || isAssigneesChanged) {
                        return res.status(403).json({ message: "Only board owners or admins can modify card details; regular members can only change the status" });
                    }
                }
            }
        }

        const updateFields = { title, description }
        if (dueDate !== undefined) updateFields.dueDate = dueDate
        if (priority !== undefined) updateFields.priority = priority
        if (status !== undefined) {
            updateFields.status = status
        }
        if (assignees !== undefined) {
            updateFields.assignees = assignees;
            if (assignees && Array.isArray(assignees)) {
                const list = await ListModel.findById(card.list);
                if (list) {
                    const board = await BoardModel.findById(list.board);
                    if (board) {
                        for (const assignee of assignees) {
                            const isOwner = board.owner.toString() === assignee.toString();
                            const isMember = board.members.some(m => m.toString() === assignee.toString());
                            if (!isOwner && !isMember) {
                                board.members.push(assignee);
                            }
                        }
                        await board.save();
                    }
                }
            }
        }
        if (assignedTo !== undefined) {
            updateFields.assignedTo = assignedTo
            if (assignedTo) {
                const list = await ListModel.findById(card.list);
                if (list) {
                    const board = await BoardModel.findById(list.board);
                    if (board) {
                        const isOwner = board.owner.toString() === assignedTo.toString();
                        const isMember = board.members.some(m => m.toString() === assignedTo.toString());
                        if (!isOwner && !isMember) {
                            board.members.push(assignedTo);
                            await board.save();
                        }
                    }
                }
            }
        }
        const updatedCard=await CardModel.findByIdAndUpdate(cardId, updateFields, {new:true})
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar")

        if (list && updatedCard) {
            const boardId = list.board;
            if (title !== undefined && title !== card.title) {
                await logActivity(boardId, req.userId, `renamed task from "${card.title}" to "${title}"`);
            }
            if (status !== undefined && status !== card.status) {
                await logActivity(boardId, req.userId, `changed task "${card.title}" status to "${status}"`);
            }
            if (priority !== undefined && priority !== card.priority) {
                await logActivity(boardId, req.userId, `set task "${card.title}" priority to "${priority}"`);
            }
            if (dueDate !== undefined) {
                const oldDueStr = card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : null;
                const newDueStr = dueDate ? new Date(dueDate).toISOString().split("T")[0] : null;
                if (oldDueStr !== newDueStr) {
                    if (newDueStr) {
                        await logActivity(boardId, req.userId, `set task "${card.title}" due date to ${newDueStr}`);
                    } else {
                        await logActivity(boardId, req.userId, `removed task "${card.title}" due date`);
                    }
                }
            }
            if (assignedTo !== undefined) {
                const oldAssigned = card.assignedTo ? card.assignedTo.toString() : null;
                const newAssigned = assignedTo ? assignedTo.toString() : null;
                if (oldAssigned !== newAssigned) {
                    if (assignedTo) {
                        const userObj = await UserModel.findById(assignedTo);
                        await logActivity(boardId, req.userId, `assigned task "${card.title}" to ${userObj ? userObj.name : "Unknown User"}`);
                    } else {
                        await logActivity(boardId, req.userId, `unassigned task "${card.title}"`);
                    }
                }
            }
        }

        res.status(200).json({message:"Card updated successfully",payload:updatedCard})
    }catch(error){
        res.status(500).json({message:"Could not update card",error:error.message})
    }
}

/**
 * Move Card (Drag & Drop functionality)
 * Handles repositioning a card within the same list or moving it to a completely different list.
 * Automatically updates the card's status based on the destination list's name and re-sequences 
 * the positions of all other cards in the affected list(s) to maintain correct order.
 */
export const moveCard=async(req,res)=>{
    const cardId=req.params.id
    const {toListId, newPosition}=req.body
    try{
        const cardToMove = await CardModel.findById(cardId);
        if (!cardToMove) {
            return res.status(404).json({ message: "Card not found" });
        }

        const oldListId = cardToMove.list.toString();

        // 1. Sync card status with destination list title
        const destList = await ListModel.findById(toListId);
        if (destList) {
            const title = destList.title.toLowerCase();
            if (title === "to do") {
                cardToMove.status = "to do";
            } else if (title === "in progress") {
                cardToMove.status = "in progress";
            } else if (title === "done" || title === "completed") {
                cardToMove.status = "completed";
            }
        }

        // 2. Assign it to the new list temporarily so it gets fetched
        cardToMove.list = toListId;
        await cardToMove.save();

        // 3. Re-sequence the destination list
        const toListCards = await CardModel.find({ list: toListId }).sort({ position: 1 });
        const filteredCards = toListCards.filter(c => c._id.toString() !== cardId);
        
        // Insert the card at the exact target index
        filteredCards.splice(newPosition, 0, cardToMove);

        for (let i = 0; i < filteredCards.length; i++) {
            await CardModel.findByIdAndUpdate(filteredCards[i]._id, { position: i });
        }

        // 4. Re-sequence the old list if cross-list move
        if (oldListId !== toListId) {
            const oldListCards = await CardModel.find({ list: oldListId }).sort({ position: 1 });
            const filteredOld = oldListCards.filter(c => c._id.toString() !== cardId);
            for (let i = 0; i < filteredOld.length; i++) {
                await CardModel.findByIdAndUpdate(filteredOld[i]._id, { position: i });
            }
        }

        const updatedCard = await CardModel.findById(cardId)
            .populate("assignedTo", "name email avatar")
            .populate("assignees", "name email avatar")
            .populate("createdBy", "name email avatar");

        if (destList && updatedCard) {
            await logActivity(destList.board, req.userId, `moved task "${updatedCard.title}" to list "${destList.title}"`);
        }

        res.status(200).json({ message: "Card moved successfully", payload: updatedCard });
    }catch(error){
        res.status(500).json({message:"Could not move card",error:error.message})
    }
}

/**
 * Soft Delete a Card
 * Moves the card to the trash by setting isDeleted to true.
 * Only board owners or admins can delete tasks.
 */
export const deleteCards=async(req,res)=>{
    const cardId=req.params.id
    try{
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
                    return res.status(403).json({ message: "Only board owners or admins can delete tasks" });
                }
            }
        }
        const deleteCard = await CardModel.findByIdAndUpdate(
            cardId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        )
        if(deleteCard){
            if (list) {
                await logActivity(list.board, req.userId, `deleted task "${deleteCard.title}"`);
            }
            res.status(200).json({message:"Card deleted successfully",payload:deleteCard})
        }
        else{
            res.status(404).json({message:"Card not found"})
        }
    }catch(error){
        res.status(500).json({message:"Could not delete card",error:error.message})
    }
}

/**
 * Trash Management: Get all soft-deleted cards for a specific board
 * Looks up all lists in the board first, then finds all deleted cards belonging to those lists.
 */
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

/**
 * Trash Management: Restore a soft-deleted card back to its list
 * If the parent list was also deleted, it will auto-restore the parent list as well.
 */
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

/**
 * Trash Management: Permanently delete a card from the database
 */
export const permanentDeleteCard = async (req, res) => {
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
                    return res.status(403).json({ message: "Only board owners or admins can permanently delete tasks" });
                }
            }
        }
        const deletedCard = await CardModel.findByIdAndDelete(cardId);
        if (deletedCard) {
            if (list) {
                await logActivity(list.board, req.userId, `permanently deleted task "${deletedCard.title}"`);
            }
            res.status(200).json({ message: "Card permanently deleted", payload: deletedCard })
        } else {
            res.status(404).json({ message: "Card not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Could not permanently delete card", error: error.message })
    }
}

// ── File Attachments ──────────────────────────────────────

/**
 * Upload one or multiple attachments to a card
 * Uses Cloudinary for secure file storage and streams files directly from memory.
 * Only board owners or admins can upload attachments to tasks.
 */
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

        const { default: cloudinary } = await import("../config/cloudinary.js");

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

/**
 * Delete a specific attachment from a card
 * Removes the file reference from the DB and performs a best-effort cleanup from Cloudinary.
 */
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
                const { default: cloudinary } = await import("../config/cloudinary.js");
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

// ── Remarks ──────────────────────────────────────────────

/**
 * Add a remark (comment) to a card
 * Remarks can contain text, multiple file attachments, or both.
 * Any board member can add remarks to a card.
 */
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
            const { default: cloudinary } = await import("../config/cloudinary.js");
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

/**
 * Delete a remark from a card
 * Users can delete their own remarks. Board owners and admins can delete anyone's remarks.
 * Automatically cleans up any files attached specifically to this remark from Cloudinary.
 */
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
                const { default: cloudinary } = await import("../config/cloudinary.js");
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

