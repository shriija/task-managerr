import {ListModel} from '../../models/List.js'

export const getDeletedLists = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const deletedLists = await ListModel.find({
            board: boardId,
            isDeleted: true
        })
        res.status(200).json({ message: "Deleted lists fetched", payload: deletedLists })
    } catch (error) {
        res.status(500).json({ message: "Could not fetch deleted lists", error: error.message })
    }
}
