import exp from 'express'
import { AddList } from '../controllers/ListController.js';
const ListApp = exp.Router()

ListApp.post('/addList',AddList)
export default ListApp;