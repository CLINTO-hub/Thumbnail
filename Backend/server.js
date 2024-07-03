import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import ConnectDB from './db/ConnectDB.js';
import UserRoute from '../Backend/route/UserRoute.js';
import ImageRoute from '../Backend/route/ImageRoute.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express()
const server = http.createServer(app)


const corsOptions = {
    origin: true,
    credentials: true,
  };
app.get('/',(req,res)=>{
    res.send('Hello world');
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/auth',UserRoute)
app.use('/image',ImageRoute)

server.listen(PORT,()=>{
    ConnectDB()
    console.log(`Server started on port ${PORT}`);
})

