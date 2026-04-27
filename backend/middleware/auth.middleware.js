import jwt from 'jsonwebtoken';
import projectModel from '../models/project.model.js';

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

export const isOwner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await projectModel.findById({_id:id});
        if(req.userId != project.owner){
            return res.status(401).json({
                message: "Invalid user"
            })
        }

        req.owner = project.owner;
        next();
    } catch (error) {
        return res.status(500).json({
            message: `Is Owner error: ${error}`
        })
    }
}