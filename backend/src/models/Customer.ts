import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
    },

    gstNumber: {
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

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
