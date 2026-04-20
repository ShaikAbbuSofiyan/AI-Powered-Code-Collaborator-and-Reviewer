import express from 'express';
import dotenv  from "dotenv";
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'
dotenv.config()

const PORT = process.env.PORT || 5000;

connectDB()

const app = express();

app.use(express.json()) 
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("<h1>Healthy</h1>")
});

app.use('/api/auth',authRouter);

app.listen(PORT, async ()=>{
    console.log(`Backend is Running on ${PORT}`);
});
