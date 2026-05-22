import { CardModel } from '../../models/Card.js';
import { ListModel } from '../../models/List.js';
import { logActivity } from '../../utils/activityLogger.js';

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
