import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';
import { logActivity } from '../../utils/activityLogger.js';
import { parseLocalDate } from './helpers.js';

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
