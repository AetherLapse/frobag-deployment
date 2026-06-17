const Order =
  require("../models/order.model");

const Product =
  require("../models/product.model");

const User =
  require("../models/user.model");




// ================= DASHBOARD =================

const getDashboardStats =
  async (req, res) => {

    try {


      // ================= DATE =================

      const now =
        new Date();


      const startOfDay =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );


      const startOfMonth =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );


      const startOfYear =
        new Date(
          now.getFullYear(),
          0,
          1
        );




      // ================= TOTAL COUNTS =================

      const [
        totalProducts,
        totalUsers,
        totalOrders,
        todayOrders,
        monthOrders,
        yearOrders
      ] = await Promise.all([

        Product.countDocuments(),

        User.countDocuments(),

        Order.countDocuments(),

        Order.countDocuments({
          createdAt: {
            $gte: startOfDay,
          },
        }),

        Order.countDocuments({
          createdAt: {
            $gte: startOfMonth,
          },
        }),

        Order.countDocuments({
          createdAt: {
            $gte: startOfYear,
          },
        }),

      ]);




      // ================= REVENUE =================

      const revenueData =
        await Order.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalPrice",
              },
            },
          },
        ]);


      const totalRevenue =
        revenueData[0]?.total || 0;




      // ================= TODAY REVENUE =================

      const todayRevenueData =
        await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfDay,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalPrice",
              },
            },
          },
        ]);


      const todayRevenue =
        todayRevenueData[0]?.total || 0;




      // ================= MONTH REVENUE =================

      const monthRevenueData =
        await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfMonth,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalPrice",
              },
            },
          },
        ]);


      const monthRevenue =
        monthRevenueData[0]?.total || 0;




      // ================= YEAR REVENUE =================

      const yearRevenueData =
        await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfYear,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalPrice",
              },
            },
          },
        ]);


      const yearRevenue =
        yearRevenueData[0]?.total || 0;




      // ================= RESPONSE =================

      res.json({

        success: true,


        products:
          totalProducts,


        users:
          totalUsers,


        orders:
          totalOrders,


        revenue:
          totalRevenue,




        // TODAY

        todayOrders,

        todayRevenue,




        // MONTH

        monthOrders,

        monthRevenue,




        // YEAR

        yearOrders,

        yearRevenue,

      });


    } catch (error) {


      console.log(error);


      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };




// ================= EXPORT =================

module.exports = {

  getDashboardStats,

};