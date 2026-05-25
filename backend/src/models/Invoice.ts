import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    customerName: {
      type: String,
      default: "",
    },

    invoiceNumber: {
      type: String,
    },

    totalAmount: {
      type: Number,
    },

    items: [
      {
        name: {
          type: String,
        },

        quantity: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
        },
      },
    ],

    gstAmount: {
      type: Number,
      default: 0,
    },

    billDate: {
      type: String,
    },

    notes: {
      type: String,
      default: "",
    },

    rawText: {
      type: String,
    },

    fileUrl: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },

  {
    timestamps: true,
  },
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
