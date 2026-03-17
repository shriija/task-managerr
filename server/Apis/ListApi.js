import exp from 'express'
import { AddList, deleteList } from '../controllers/ListController.js';
import { getListsByBoard } from '../controllers/ListController.js';
const ListApp = exp.Router()

ListApp.post('/addList',AddList)
ListApp.delete('/deleteList/:id',deleteList)
ListApp.get('/board/:boardId', getListsByBoard)
export default ListApp;