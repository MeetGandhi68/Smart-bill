import { Request, Response } from "express";

import Invoice from "../models/Invoice";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { customer, invoiceNumber, totalAmount, gstAmount, billDate, notes } =
      req.body;

    const invoice = await Invoice.create({
      customer,
      invoiceNumber,
      totalAmount,
      gstAmount,
      billDate,
      notes,

      createdBy: (req as any).user.id,
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCustomerInvoices = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.customerId as string;

    const invoices = await Invoice.find({
      customer: customerId,

      createdBy: (req as any).user.id,
    })

      .populate("customer")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
