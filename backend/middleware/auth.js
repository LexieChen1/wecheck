<<<<<<< HEAD
// backend/src/auth.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Resolve path reliably (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
  // Prefer env var in prod; fallback to local JSON for dev
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? process.env.GOOGLE_APPLICATION_CREDENTIALS
    : path.join(__dirname, "../serviceAccountKey.json");

  const serviceAccount = JSON.parse(readFileSync(saPath, "utf-8"));
=======
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin if not already
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync("./serviceAccountKey.json", "utf-8")
  );
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

<<<<<<< HEAD
export async function authenticateUser(req, res, next) {
  // Accept "Bearer <token>" or raw token just in case
  const h = req.header("Authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : h.trim();
  if (!token) return res.status(401).json({ msg: "Missing token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Make common fields easy to use
    req.user = { uid: decoded.uid, email: decoded.email ?? null };
    next();
  } catch (err) {
    console.error("Token verification failed:", err?.message);
    res.status(401).json({ msg: "Invalid token" });
  }
}

export const requireFirebaseAuth = async (req, res, next) => {
  try {
    const authz = req.headers.authorization || "";
    const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUid = decoded.uid;
    req.firebaseEmail = decoded.email || null;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateUser; 
=======
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
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
