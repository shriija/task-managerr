export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            partitioned: true
        })
        res.status(200).json({message:"logout success"})
        
    } catch (error) {
        res.status(201).json({error:error.message})
    }
}
