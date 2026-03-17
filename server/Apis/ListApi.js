import exp from 'express'
import { AddList, deleteList, getListsByBoard, getList } from '../controllers/ListController.js';
const ListApp = exp.Router()

//create list
ListApp.post('/addList',AddList)

//delete list
ListApp.delete('/deleteList/:id',deleteList)

//get list by board ID
ListApp.get('/getLists/:boardId', getListsByBoard)

//get list by id
ListApp.get('/getListById/:id', getList )
export default ListApp;