import express from 'express';
import userModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Register =  async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = await userModel.findOne({email});
        if(user){
            return res.status(409).json({
                message: "user already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name, email, password: hashedPassword
        });
        const token = jwt.sign({user: newUser}, process.env.JWT_SECRET);
        res.cookie('token', token);
        console.log("user created successfully");
        return res.status(200).json({
            newUser
        });
        
    } catch (error) {
        return res.status(500).json({
            message: `User Register error: ${error}`
        });
    }
}


export const Login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const decodedPassword = await bcrypt.compare(password, user.password)
        if(!decodedPassword){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({user}, process.env.JWT_SECRET);
        res.cookie('token', token);
        return res.status(200).json({
            user
        });
        
    } catch (error) {
        return res.status(500).json({
            message: `User Login error: ${error}`
        });
    }
}

export const getUser = async (req, res) => {
    const user = await userModel.findById(req.userId);
    if(!user){
        return res.status(404).json({
            message: "Invalid user"
        });
    }
    return res.status(200).json({
        user
    });
}