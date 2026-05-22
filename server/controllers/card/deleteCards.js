import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { BoardModel } from '../../models/Board.js';
import { logActivity } from '../../utils/activityLogger.js';

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
