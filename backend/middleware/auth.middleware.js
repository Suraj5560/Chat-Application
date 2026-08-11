import userModel from '../model/user.model.js';
import jwt from 'jsonwebtoken';


export async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, "&&^*&*77878*^&*");

        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next();

    } catch (err) {
        console.log(err.message);
        res.json({
            success: false,
            message: "User not found"
        });
    }
}