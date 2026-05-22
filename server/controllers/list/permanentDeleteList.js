import {ListModel} from '../../models/List.js'
import { CardModel } from '../../models/Card.js'
import { logActivity } from '../../utils/activityLogger.js'

export const permanentDeleteList = async (req, res) => {
    try {
        const listId = req.params.id;
        const deletedList = await ListModel.findByIdAndDelete(listId);
        if (deletedList) {
            await CardModel.deleteMany({ list: listId })
            await logActivity(deletedList.board, req.userId, `permanently deleted list "${deletedList.title}"`);
            res.status(200).json({ message: "List permanently deleted", payload: deletedList })
        } else {
            res.status(404).json({ message: "List not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Could not permanently delete list", error: error.message })
    }
}
