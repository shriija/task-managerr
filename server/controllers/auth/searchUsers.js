import {UserModel} from '../../models/User.js'

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
