import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/AuthRoutes.js';
import expenseRoutes from './routes/ExpenseRoutes.js';
import taskRoutes from './routes/TaskRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
connectDB()

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)



app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})