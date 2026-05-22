import {UserModel} from '../../models/User.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../../utils/generateToken.js'

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
            sameSite:"none",
            partitioned: true 
        });
        res.status(200).json({message:"signin sucessfull",payload:userObj})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
