import express, { Request, Response } from "express";

import upload from "../middleware/upload.middleware";

import { preprocessImage } from "../services/imagePreprocess.service";

import { extractTextFromImage } from "../services/ocr.service";

import { parseInvoiceData } from "../services/parser.service";

import Invoice from "../models/Invoice";

const router = express.Router();

router.post(
  "/",
  upload.single("invoice"),

  async (req: Request, res: Response) => {
    console.log("NEW OCR ROUTE HIT");

    try {
      if (!(req as any).file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      /* PREPROCESS IMAGE */
      const processedImagePath = await preprocessImage((req as any).file.path);

      /* OCR TEXT */
      const extractedText = await extractTextFromImage(processedImagePath);

      const parsedData = parseInvoiceData(extractedText);

      console.log("PARSED DATA:");
      console.log(parsedData);

      /* DUPLICATE CHECK */

      let existingInvoice = null;

      const cleanedTotal =
        Number(parsedData.totalAmount?.replace(/,/g, "")) || 0;

      /* CHECK USING INVOICE NUMBER */
      if (parsedData.invoiceNumber && parsedData.invoiceNumber.trim() !== "") {
        existingInvoice = await Invoice.findOne({
          invoiceNumber: parsedData.invoiceNumber,
        });
      }

      /* FALLBACK CHECK USING RAW TEXT */
      if (!existingInvoice) {
        existingInvoice = await Invoice.findOne({
          rawText: extractedText,
        });
      }

      /* FINAL CHECK */
      if (existingInvoice) {
        return res.status(400).json({
          success: false,
          duplicate: true,
          message: "Duplicate invoice detected",
        });
      }

      /* SAVE TO DATABASE */

      const savedInvoice = await Invoice.create({
        invoiceNumber: parsedData.invoiceNumber,

        billDate: parsedData.billDate,

        items: parsedData.items,

        totalAmount: Number(parsedData.totalAmount?.replace(/,/g, "")) || 0,

        rawText: extractedText,

        fileUrl: (req as any).file.path,
      });

      console.log("INVOICE SAVED:");
      console.log(savedInvoice);

      return res.status(200).json({
        success: true,

        message: "OCR completed successfully",

        parsedData,

        extractedText,

        savedInvoice,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Processing failed",
      });
    }
  },
);

export default router;
