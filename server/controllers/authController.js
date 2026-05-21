import {UserModel} from '../models/User.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../utils/generateToken.js'


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
        await newUser.save()
        res.status(201).json({message:"user created sucessfully"})
    } catch (error) {
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
            secure:true,
            sameSite:"none"
        });
        res.status(200).json({message:"signin sucessfull",payload:userObj})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })
        res.status(200).json({message:"logout success"})
        
    } catch (error) {
        res.status(201).json({error:error.message})
    }
}


// Verify if the current session (JWT cookie) is still valid
export const verifySession = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password')
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        res.json({ message: "Session valid", payload: user })
    } catch (error) {
        res.status(401).json({ message: "Session invalid" })
    }
}

// Search users by name or email
export const searchUsers = async (req, res) => {
    const { q } = req.query
    try {
        if (!q) {
            return res.json({ payload: [] })
        }
        const users = await UserModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).select('-password').limit(20)
        res.json({ payload: users })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}