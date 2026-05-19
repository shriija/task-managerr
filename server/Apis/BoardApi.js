import exp from 'express'
import { addBoard, getBoard, deleteBoard, getMyBoards } from '../controllers/boardController.js'
import verifyToken from '../utils/verifyToken.js'

const BoardApp = exp.Router()

BoardApp.post('/addBoard', verifyToken, addBoard)

BoardApp.get('/', verifyToken, getMyBoards)     

BoardApp.get('/:id', verifyToken, getBoard)

BoardApp.delete('/deleteBoard/:id', verifyToken, deleteBoard)
export default BoardApp