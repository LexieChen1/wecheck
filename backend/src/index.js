import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoutes.js";
import tripRoutes from "../routes/trips.js";
import billRoutes from "../routes/billRoutes.js";
import houseRoutes from "../routes/houseRoutes.js";
import profileRoutes from "../routes/myProfile.js"; 
import dashboardRoutes from "../routes/dashboardRoutes.js"


dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://wecheck-d63atxj45-lexies-projects-13ef7093.vercel.app",
    ],
    credentials: true,
  })
);
// Increase body parser limit for large image data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/profile", profileRoutes); 
app.use("/api/dashboard", dashboardRoutes);

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
