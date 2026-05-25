import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcryptjs";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
