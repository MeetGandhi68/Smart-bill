import express from "express";

import { registerAdmin, loginAdmin } from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: (req as any).user,
  });
});

export default router;
