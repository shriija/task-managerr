import exp from 'express'
import {addBoard} from '../controllers/boardController.js'
const BoardApp = exp.Router()

BoardApp.post('/addBoard',addBoard)

export default BoardApp;