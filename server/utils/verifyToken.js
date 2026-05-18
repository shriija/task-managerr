import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {

  const {token} = req.cookies

  if (!token) {
    return res.status(401).json({ message:"No Token" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.userId = decoded.id

    next()

  } catch (err) {
    return res.status(401).json({ message:"Invalid token" })
  }
}

export default verifyToken