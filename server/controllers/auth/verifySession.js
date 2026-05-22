import {UserModel} from '../../models/User.js'

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
