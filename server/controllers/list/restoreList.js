import {ListModel} from '../../models/List.js'
import { logActivity } from '../../utils/activityLogger.js'

export const restoreList = async (req, res) => {
    try {
        const listId = req.params.id;
        const restoredList = await ListModel.findByIdAndUpdate(
            listId,
            { isDeleted: false, deletedAt: null },
            { new: true }
        )
        if (restoredList) {
            await logActivity(restoredList.board, req.userId, `restored list "${restoredList.title}"`);
            res.status(200).json({ message: "List restored", payload: restoredList })
        } else {
            res.status(404).json({ message: "List not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Could not restore list", error: error.message })
    }
}
