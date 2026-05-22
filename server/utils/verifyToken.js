import jwt from "jsonwebtoken";

/**
 * Express middleware to verify JSON Web Tokens (JWT) for protected routes.
 * It extracts the token from the HTTP-only cookies, verifies its signature,
 * and attaches the decoded user ID to the request object for subsequent controllers.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
  // Extract token from cookies (populated by cookie-parser middleware)
  const { token } = req.cookies;

  // If no token exists, the user is not authenticated
  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }

  try {
    // Verify the token signature using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the user ID from the token payload to the request object
    req.userId = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If verification fails (e.g., token expired, invalid signature)
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;