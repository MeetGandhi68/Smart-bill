import { Request, Response } from "express";

import Customer from "../models/Customer";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, gstNumber } = req.body;

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      gstNumber,

      createdBy: (req as any).user.id,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({
      createdBy: (req as any).user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
