import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';
import { UserModel } from '../../models/User.js';
import { logActivity } from '../../utils/activityLogger.js';
import { parseLocalDate } from './helpers.js';

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
