import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
export const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, 
    {
    expiresIn: "30s",
});
};
