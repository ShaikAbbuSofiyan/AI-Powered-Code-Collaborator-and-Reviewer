import jwt from 'jsonwebtoken';
import projectModel from '../models/project.model.js';
import { response } from 'express';

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
        const project = await projectModel.findById(id);
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

export const isMember = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const project = await projectModel.findById(id);
        if(!project){
            return res.status(404).json({
                message:"project is not available"
            })
        }
        
        let found = false;
        for(let i = 0; i<project.members.length; i++){
            if(project.members[i] === req.userId){
                found = true;
                break;
            }
        }
        if(found){
            req.project = project._id;
        }
        else{
            return res.status(504).json({
                message:"user is not a member of the project"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message:`isMember error: ${error}`
        })
    }
}