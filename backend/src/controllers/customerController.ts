import { Request, Response } from "express";
import Customer from "../models/Customer";

/* CREATE CUSTOMER */
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
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* GET ALL CUSTOMERS */
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({
      createdBy: (req as any).user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* GET SINGLE CUSTOMER */
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: (req as any).user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* UPDATE CUSTOMER */
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, gstNumber } = req.body;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: (req as any).user.id,
      },
      {
        name,
        phone,
        email,
        address,
        gstNumber,
      },
      {
        returnDocument: "after",
      },
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

