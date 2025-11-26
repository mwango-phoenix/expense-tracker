import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { connectDB } from './lib/db.js';

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/income", incomeRoutes)
app.use("/api/expense", expenseRoutes)


// Middleware
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
