import exp from 'express'
import { AddList, deleteList } from '../controllers/ListController.js';
const ListApp = exp.Router()

ListApp.post('/addList',AddList)
ListApp.delete('/deleteList/:id',deleteList)
export default ListApp;