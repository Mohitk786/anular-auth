import express from 'express';
import authRoutes from './routes/auth.js'
import { dbConnect } from './config/db.js';
import dotenv from "dotenv"
import bodyParser from 'body-parser';
import cors from 'cors'
import dashboardRoutes from './routes/dashboard.js';
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config()
const PORT = process.env.PORT || 3000;
app.use(express.json())


app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.DOMAIN_URL,
  credentials:true
}))

dbConnect()




app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});