import {UserModel} from '../models/User.js'
import bcrypt from 'bcryptjs'
export const signup = async(req,res) =>{
    const user = req.body;
    try {
        const response = await UserModel.validate();
        const hashedPass = bcrypt.hash(user.pass)
    } catch (error) {
        
    }
}
export const signin = async(req,res)=>{

}
export const logout = async(req,res)=>{
    
}
export const authenticate = async(req,res) =>{

}