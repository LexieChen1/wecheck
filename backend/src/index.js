import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoutes.js";
import tripRoutes from "../routes/trips.js";
import billRoutes from "../routes/billRoutes.js";
import houseRoutes from "../routes/houseRoutes.js";
<<<<<<< HEAD
import profileRoutes from "../routes/myProfile.js"; 
=======
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
<<<<<<< HEAD

// Increase body parser limit for large image data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
=======
app.use(express.json());
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bills", billRoutes);
<<<<<<< HEAD
app.use("/api/houses", houseRoutes);
app.use("/api/profile", profileRoutes); 
=======
app.use("/api/house", houseRoutes);

>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce

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
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
