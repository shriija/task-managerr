import exp from 'express'
import { AddList, deleteList, getListsByBoard, getList, updateList, getDeletedLists, restoreList, permanentDeleteList } from '../controllers/ListController.js';
import verifyToken from '../utils/verifyToken.js'
const ListApp = exp.Router()

//create list
ListApp.post('/addList', verifyToken, AddList)

//delete list
ListApp.delete('/deleteList/:id', verifyToken, deleteList)

//get list by board ID
ListApp.get('/getLists/:boardId', verifyToken, getListsByBoard)

//get list by id
ListApp.get('/getListById/:id', verifyToken, getList )

//update list
ListApp.put('/updateList/:id', verifyToken, updateList)

// Trash endpoints
ListApp.get('/trash/deleted/:boardId', verifyToken, getDeletedLists)
ListApp.put('/restore/:id', verifyToken, restoreList)
ListApp.delete('/permanent/:id', verifyToken, permanentDeleteList)

export default ListApp;