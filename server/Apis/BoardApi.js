import exp from 'express'
import { addBoard, deleteBoard, getBoard } from '../controllers/boardController.js'
import verifyToken from '../utils/verifyToken.js'

const BoardApp = exp.Router()

BoardApp.post('/addBoard', verifyToken, addBoard)
BoardApp.get('/:id', verifyToken, getBoard)
BoardApp.delete('/deleteBoard/:id',deleteBoard)
export default BoardApp