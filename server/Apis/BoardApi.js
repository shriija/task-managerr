import exp from 'express'
import { addBoard, getBoard, deleteBoard, getMyBoards, getDeletedBoards, restoreBoard, permanentDeleteBoard, updateBoard, getSharedBoards } from '../controllers/boardController.js'
import { inviteByEmail, generateInviteLink, acceptInvite } from '../controllers/inviteController.js'
import verifyToken from '../utils/verifyToken.js'

const BoardApp = exp.Router()

BoardApp.post('/addBoard', verifyToken, addBoard)

BoardApp.get('/', verifyToken, getMyBoards)     

BoardApp.get('/shared/all', verifyToken, getSharedBoards)

BoardApp.get('/trash/deleted', verifyToken, getDeletedBoards)

BoardApp.put('/updateBoard/:id', verifyToken, updateBoard)

// ── Invite routes ─────────────────────────────────────────────
BoardApp.post('/invite/email/:boardId', verifyToken, inviteByEmail)
BoardApp.post('/invite/link/:boardId', verifyToken, generateInviteLink)
BoardApp.get('/invite/accept/:token', verifyToken, acceptInvite)

BoardApp.get('/:id', verifyToken, getBoard)

BoardApp.delete('/deleteBoard/:id', verifyToken, deleteBoard)

BoardApp.put('/restore/:id', verifyToken, restoreBoard)

BoardApp.delete('/permanent/:id', verifyToken, permanentDeleteBoard)

export default BoardApp