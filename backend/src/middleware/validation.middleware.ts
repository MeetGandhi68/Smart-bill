import { body } from "express-validator";

export const manualInvoiceValidation = [
  /* CUSTOMER NAME */
  body("customerName").notEmpty().withMessage("Customer name is required"),

  /* INVOICE NUMBER */
  body("invoiceNumber").notEmpty().withMessage("Invoice number is required"),

  /* ITEMS */
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  /* GST */
  body("gstAmount")
    .optional()
    .isNumeric()
    .withMessage("GST amount must be numeric"),
];
