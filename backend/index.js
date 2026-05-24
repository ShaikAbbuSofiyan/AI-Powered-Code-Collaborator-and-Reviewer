import express from 'express';
import dotenv  from "dotenv";
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'
import projectRouter from './routes/project.routes.js';
import cors from 'cors';
dotenv.config()

connectDB()
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URI || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));



app.use(express.json()) 
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("<h1>Healthy</h1>")
});

app.use('/api/auth',authRouter);
app.use('/api/projects', projectRouter);

app.listen(PORT, async ()=>{
    console.log(`Backend is Running on ${PORT}`);
});
