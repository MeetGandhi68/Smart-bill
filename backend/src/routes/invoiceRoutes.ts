import express, { Request, Response } from "express";

import Invoice from "../models/Invoice";

import Customer from "../models/Customer";

import { validationResult } from "express-validator";

import { manualInvoiceValidation } from "../middleware/validation.middleware";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/* GET ALL INVOICES */
router.get(
  "/",
  protect,

  async (_req, res) => {
    try {
      const invoices = await Invoice.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        count: invoices.length,
        invoices,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch invoices",
      });
    }
  },
);

/* CREATE MANUAL INVOICE */
router.post(
  "/manual",
  protect,
  manualInvoiceValidation,
  async (req: Request, res: Response) => {
    try {
      const { customer, invoiceNumber, billDate, items, gstAmount, notes } =
        req.body;
      /* VALIDATION */
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      /* GET CUSTOMER DETAILS */
      const customerData = await Customer.findById(customer);

      if (!customerData) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      /* CALCULATE TOTAL */
      let totalAmount = 0;

      const formattedItems = items.map((item: any) => {
        const price = Number(item.price) || 0;

        totalAmount += price;

        return {
          name: item.name,
          quantity: item.quantity || "",
          price,
        };
      });

      /* GST */
      const gst = Number(gstAmount) || 0;

      const grandTotal = totalAmount + gst;

      /* SAVE */
      const invoice = await Invoice.create({
        customer,
        customerName: customerData.name,
        invoiceNumber,
        billDate,
        items: formattedItems,
        gstAmount: gst,
        totalAmount: grandTotal,
        notes,
        rawText: "MANUAL ENTRY",
      });

      res.status(201).json({
        success: true,
        message: "Manual invoice created successfully",
        invoice,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to create manual invoice",
      });
    }
  },
);

/* SEARCH & FILTER INVOICES */
router.get("/search", protect, async (req, res) => {
  try {
    const { invoiceNumber, customerName, date } = req.query;

    let query: any = {};

    /* SEARCH BY INVOICE NUMBER */
    if (invoiceNumber) {
      query.invoiceNumber = {
        $regex: invoiceNumber,
        $options: "i",
      };
    }

    /* SEARCH BY CUSTOMER NAME */
    if (customerName) {
      query.customerName = {
        $regex: customerName,
        $options: "i",
      };
    }

    /* SEARCH BY DATE */
    if (date) {
      query.billDate = {
        $regex: date,
        $options: "i",
      };
    }

    const invoices = await Invoice.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

/* CUSTOMER INVOICES */
router.get("/customer/:customerId", protect, async (req, res) => {
  try {
    const customerId = req.params.customerId as string;

    const invoices = await Invoice.find({
      customer: customerId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer invoices",
    });
  }
});

/* GET SINGLE INVOICE */
router.get("/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
});

/* UPDATE INVOICE */
router.put("/:id", protect, async (req, res) => {
  try {
    const updateData: any = {
      ...req.body,
    };

    /* AUTO CALCULATE TOTAL FROM ITEMS */
    if (req.body.totalAmount) {
      updateData.totalAmount = Number(req.body.totalAmount);
    }

    if (req.body.gstAmount) {
      updateData.gstAmount = Number(req.body.gstAmount);
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,

      updateData,

      {
        returnDocument: "after",
      },
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice",
    });
  }
});

/* DELETE INVOICE */
router.delete(
  "/:id",
  protect,

  async (req, res) => {
    try {
      const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

      if (!deletedInvoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Invoice deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Failed to delete invoice",
      });
    }
  },
);

export default router;
