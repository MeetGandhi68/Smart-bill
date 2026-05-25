import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createCustomer,
  getCustomers,
} from "../controllers/customerController";

const router = express.Router();

router.post("/create", protect, createCustomer);

router.get("/all", protect, getCustomers);

export default router;
