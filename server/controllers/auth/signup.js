import {UserModel} from '../../models/User.js'
import bcrypt from 'bcryptjs'

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
