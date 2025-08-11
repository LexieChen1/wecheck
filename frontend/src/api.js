import axios from "axios";
import { getAuth, onIdTokenChanged } from "firebase/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
});

const auth = getAuth();
onIdTokenChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
});