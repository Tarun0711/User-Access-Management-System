import "reflect-metadata";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { AppDataSource } from "./data-source";

import authRoutes from "./routes/auth.routes";
import accessRequestRoutes from "./routes/access-request.routes";
import softwareRoutes from "./routes/software.routes";
import userRoutes from "./routes/user.routes";

config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/access-requests", accessRequestRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  }); 