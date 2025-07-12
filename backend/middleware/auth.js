import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin if not already
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync("./serviceAccountKey.json", "utf-8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access Denied: No token provided" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification failed", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authenticateUser;