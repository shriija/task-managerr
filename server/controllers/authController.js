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
        res.status(500).json({error:error.message})
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

// Update user profile (name and username)
export const updateUserProfile = async (req, res) => {
    try {
        const { name, username } = req.body
        const userId = req.userId

        // Check if username is already taken
        if (username) {
            const existingUser = await UserModel.findOne({ username, _id: { $ne: userId } })
            if (existingUser) {
                return res.status(409).json({ message: "Username already taken" })
            }
        }

        const updateData = {}
        if (name) updateData.name = name
        if (username) updateData.username = username

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ 
            message: "Profile updated successfully", 
            payload: updatedUser 
        })
    } catch (error) {
        console.log("error in updateUserProfile:", error)
        res.status(500).json({ error: error.message })
    }
}

// Update user password
export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body
        const userId = req.userId

        // Validate input
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New passwords do not match" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Old password is incorrect" })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 8)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        console.log("error in updatePassword:", error)
        res.status(500).json({ error: error.message })
    }
}