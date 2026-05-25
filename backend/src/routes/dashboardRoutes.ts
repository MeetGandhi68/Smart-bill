import express from "express";

import Invoice from "../models/Invoice";

const router = express.Router();

/* DASHBOARD STATS */
router.get("/stats", async (_req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();

    const revenueResult = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
          averageInvoice: {
            $avg: "$totalAmount",
          },
          highestInvoice: {
            $max: "$totalAmount",
          },
        },
      },
    ]);

    const stats = revenueResult[0] || {
      totalRevenue: 0,
      averageInvoice: 0,
      highestInvoice: 0,
    };

    res.status(200).json({
      success: true,

      totalInvoices,

      totalRevenue: stats.totalRevenue,

      averageInvoice: Number(stats.averageInvoice?.toFixed(2)),

      highestInvoice: stats.highestInvoice,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
});

/* MONTHLY REVENUE */
router.get("/monthly-revenue", async (_req, res) => {
  try {
    const monthlyRevenue = await Invoice.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const formattedData = monthlyRevenue.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,

      revenue: item.revenue,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly revenue",
    });
  }
});

export default router;
