import  "dotenv/config";
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './route/userRoute.js';
import incomeRouter from "./route/incomeRoute.js";
import expenseRouter from "./route/expenseRoute.js";
import dashboardRouter from "./route/dashboardRoute.js";


const app = express();
const port=4000;

//Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({limit: '5mb',extended:true}));
app.use((req, res, next) => {
    console.log("Raw Body:", req.body);
    next();
});

//DB
connectDB();



//ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

app .get('/',(req,res)=>{
     res.send("API is working");
})

export default app;
