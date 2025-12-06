import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { connectDB } from './lib/db.js';

// job.start();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/income", incomeRoutes)
app.use("/api/expense", expenseRoutes)
app.use("/api/dashboard", dashboardRoutes)


const PORT = process.env.PORT;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
