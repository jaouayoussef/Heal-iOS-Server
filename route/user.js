import { Router } from "express";
import {
  login,
  register,
  sendResetPasswordEmail,
  checkResetCode,
  resetPassword,
  getUser,
  googleAuth,
  setPassword,
  setUserLocation,
  findNearbyUsers,
  updatePassword,
  updateUsername,
  addGoals,
  addHealth,
  hideLocation,
  updateAchievements
} from "../controller/user.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/requestCode", sendResetPasswordEmail);
router.post("/checkCode", checkResetCode);
router.post("/resetPassword", resetPassword);
router.get("/getUser", requireAuth, getUser);
router.post("/googleAuth", googleAuth);
router.post("/setPassword", requireAuth,setPassword);
router.post("/setUserLocation", requireAuth,setUserLocation);
router.get("/findNearbyUsers", requireAuth,findNearbyUsers);
router.post("/updatePassword", requireAuth,updatePassword);
router.post("/updateUsername", requireAuth,updateUsername);
router.post("/addGoals", requireAuth,addGoals);
router.post("/addHealth", requireAuth,addHealth);
router.post("/hideLocation", requireAuth,hideLocation);
router.post("/updateAchievements", requireAuth,updateAchievements);

export default router;
