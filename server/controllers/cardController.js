import { CardModel } from "../models/Card.js";
import { ListModel } from "../models/List.js";
import { BoardModel } from "../models/Board.js";

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

//Create Cards
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

        res.status(201).json({message:"New card added successfully", payload:saveCard})
    }
    catch(error){
        res.status(500).json({ message: "Error adding card" });
    }
}

//Get card by id
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

//Fetch Cards
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

//Update card
export const updateCard=async(req,res)=>{
    const cardId=req.params.id
    const {title, description, dueDate, priority, status, assignedTo, assignees}=req.body
    if(dueDate){
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = parseLocalDate(dueDate);
        due.setHours(0, 0, 0, 0);
        if(due < today){
            return res.status(400).json({message:"Due date cannot be in the past",payload:dueDate})
        }
    }
    try{
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({message:"Card not found"})
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
        res.status(200).json({message:"Card updated successfully",payload:updatedCard})
    }catch(error){
        res.status(500).json({message:"Could not update card",error:error.message})
    }
}

//Move card (drag & drop)
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
        res.status(200).json({ message: "Card moved successfully", payload: updatedCard });
    }catch(error){
        res.status(500).json({message:"Could not move card",error:error.message})
    }
}

//Delete Cards (Soft Delete)
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
            res.status(200).json({message:"Card deleted successfully",payload:deleteCard})
        }
        else{
            res.status(404).json({message:"Card not found"})
        }
    }catch(error){
        res.status(500).json({message:"Could not delete card",error:error.message})
    }
}

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
            res.status(200).json({ message: "Card permanently deleted", payload: deletedCard })
        } else {
            res.status(404).json({ message: "Card not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Could not permanently delete card", error: error.message })
    }
}

