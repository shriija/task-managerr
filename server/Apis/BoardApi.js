import exp from 'express'
import { addBoard, getBoard, deleteBoard, getMyBoards, getDeletedBoards, restoreBoard, permanentDeleteBoard } from '../controllers/boardController.js'
import verifyToken from '../utils/verifyToken.js'

const BoardApp = exp.Router()

BoardApp.post('/addBoard', verifyToken, addBoard)

BoardApp.get('/', verifyToken, getMyBoards)     

BoardApp.get('/:id', verifyToken, getBoard)

BoardApp.delete('/deleteBoard/:id', verifyToken, deleteBoard)

BoardApp.get('/trash/deleted', verifyToken, getDeletedBoards)
BoardApp.put('/restore/:id', verifyToken, restoreBoard)
BoardApp.delete('/permanent/:id', verifyToken, permanentDeleteBoard)

export default BoardApp