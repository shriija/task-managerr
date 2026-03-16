import {UserModel} from '../models/User.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../utils/generateToken.js'
import { response } from 'express';

export const signup = async(req,res) =>{
    const user = req.body;
    const response = await UserModel.findOne({email:user.email})
    if(response){
        return res.status(409).json({message:"email already exists"})
    }
    try {
        await UserModel.validate(user);
        const hashedPass = await bcrypt.hash(user.password,8)
        const newUser = new UserModel({
            name:user.name,
            email:user.email,
            password:hashedPass,
            avatar:user.avatar
        })
        newUser.save()
        res.status(201).json({message:"user created sucessfully"})
    } catch (error) {
        console.log("error in signup")
        res.json({error:error.message})
    }
}
export const signin = async(req,res)=>{

    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        const response = await bcrypt.compare(password,user.password)
        if(!response){
            return res.status(401).json({message:"invalid credentials"})
        }
        const userObj = user.toObject()
        delete userObj.password
        const token = generateToken(user)
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "lax"
        });
        res.status(200).json({message:"signin sucessfull",payload:userObj})

    } catch (error) {
        console.log("error in signin")
        res.status(200).json({error:error.message})
    }
}
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })
        res.status(200).json({message:"logout success"})
        
    } catch (error) {
        console.log("error in logout")
        res.status(201).json({error:error.message})
    }
}
