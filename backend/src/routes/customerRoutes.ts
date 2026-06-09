import express from "express";

import Invoice from "../models/Invoice";

import Customer from "../models/Customer";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/* CREATE CUSTOMER */
router.post("/create", protect, createCustomer);

/* ALL CUSTOMERS */
router.get("/all", protect, getCustomers);

/* GET SINGLE CUSTOMER */
router.get("/:id", protect, getCustomerById);

/* UPDATE CUSTOMER */
router.put("/:id", protect, updateCustomer);

/* CUSTOMER ANALYTICS */
router.get("/", protect, async (_req, res) => {
  try {
    const customers = await Invoice.aggregate([
      {
        $group: {
          _id: "$customerName",

          totalBills: {
            $sum: 1,
          },

          totalAmount: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
});

/* Delete Customer */
router.delete("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.deleteOne();

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
