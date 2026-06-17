const Product = require("../models/product.model");
const Order = require("../models/order.model");


// ================= SELLER DASHBOARD =================

const getSellerDashboard = async (req, res) => {

  try {

    const sellerProducts = await Product.find({
      vendor: req.user._id,
    });


    const productIds = sellerProducts.map(
      product => product._id.toString()
    );


    const orders = await Order.find({
      "orderItems.product": {
        $in: sellerProducts.map(
          product => product._id
        ),
      },
    });


    const totalProducts = sellerProducts.length;


    const totalOrders = orders.length;


    let totalSales = 0;


    orders.forEach(order => {

      order.orderItems.forEach(item => {

        if (
          productIds.includes(
            item.product.toString()
          )
        ) {

          totalSales +=
            (item.price || 0) *
            (item.qty || 0);

        }

      });

    });


    const pendingOrders =
      orders.filter(
        order => !order.isDelivered
      ).length;


    return res.status(200).json({

      success: true,

      totalProducts,

      totalOrders,

      totalSales,

      pendingOrders,

    });


  } catch (error) {

    console.log(
      "SELLER DASHBOARD ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard",

    });

  }

};


// ================= EXPORT =================

module.exports = {
  getSellerDashboard,
};