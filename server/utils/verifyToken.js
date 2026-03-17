import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {

  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message:"No Token" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.userId = decoded.id
    console.log(decoded)

    next()

  } catch (err) {
    console.log("JWT ERROR:",err.message)
    return res.status(401).json({ message:"Invalid token" })
  }
}

export default verifyToken