import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import uploadRoutes from "./routes/upload.routes";
import path from "path";
import dashboardRoutes from "./routes/dashboardRoutes";

import connectDB from "./config/db";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/upload", uploadRoutes);

app.use(helmet());

app.get("/", (req, res) => {
  res.send("SmartBill AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
