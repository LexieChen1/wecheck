import express from "express";
import { requireFirebaseAuth } from "../middleware/auth.js";
import { getUserByUid, upsertUserByUid } from "../models/userModel.js";

const router = express.Router();

// Read my profile
router.get("/me", requireFirebaseAuth, async (req, res) => {
  const user = await getUserByUid(req.firebaseUid);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update my profile
router.put("/me", requireFirebaseAuth, async (req, res) => {
  try {
    console.log("Updating profile for UID:", req.firebaseUid);
    console.log("Firebase email:", req.firebaseEmail);
    console.log("Request body:", req.body);
    
    const user = await upsertUserByUid({
      uid: req.firebaseUid,
      email: req.firebaseEmail,
      firstName: req.body.firstName ?? null,
      lastName:  req.body.lastName ?? null,
      phone:     req.body.phone ?? null,
      avatarUrl: req.body.avatarUrl ?? null,
      houseId:   req.body.houseId ?? null,
    });
    
    console.log("Profile updated successfully:", user);
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      message: "Failed to update profile", 
      error: error.message,
      details: error.detail || null
    });
  }
});

export default router;