import jwt from 'jsonwebtoken';

export const isUserAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).json({
                message:  "Invalid user"
            });
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if(!verify){
            return res.status(401).json({
                message:  "Invalid user"
            });
        }
        req.userId = verify?.user?._id;
        next();
    } catch (error) {
        return res.status(500).json({
            message:  `isUserAuth middleware error: ${error}`
        });
    }
}