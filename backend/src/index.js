import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoutes.js";
import tripRoutes from "../routes/trips.js";
import billRoutes from "../routes/billRoutes.js";
import houseRoutes from "../routes/houseRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/house", houseRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("Bill Splitting API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));