const Order = require("../models/order.model");

const Product = require("../models/product.model");

const sendEmail = require("../utils/sendEmail");

// ================= CREATE ORDER =================

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,

      shippingAddress,

      paymentMethod,

      totalPrice,
    } = req.body;

    // ================= VALIDATION =================

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,

        message: "No Order Items",
      });
    }

    // ================= CREATE ORDER =================

    const newOrder = new Order({
      user: req.user._id,

      orderItems,

      shippingAddress,

      paymentMethod,

      totalPrice,

      orderStatus: "Processing",

      isPaid: false,

      isDelivered: false,
    });

    // ================= SAVE ORDER =================

    const savedOrder = await newOrder.save();

    // ================= UPDATE PRODUCT STOCK =================

    for (const item of orderItems) {


  const product =
    await Product.findById(item.product);


  if (!product) {

    return res.status(404).json({

      success: false,

      message:
        `${item.name} not found`

    });

  }


  if (
    product.countInStock < item.qty
  ) {

    return res.status(400).json({

      success: false,

      message:
        `Only ${product.countInStock} ${product.name} left in stock`

    });

  }


}


// AFTER ALL PRODUCTS ARE VERIFIED


for (const item of orderItems) {


  const product =
    await Product.findById(item.product);


  product.countInStock -= item.qty;


  await product.save();

}

    // ================= EMAIL ITEMS =================

    const orderItemsHtml = orderItems
      .map(
        (item) => `

        <li style="margin-bottom:10px;">

          <strong>
            ${item.name}
          </strong>

          × ${item.qty}

          - ₹${item.price}

        </li>

      `,
      )
      .join("");

    // ================= EMAIL TEMPLATE =================

    const message = `

      <div style="
        font-family:Arial;
        padding:20px;
      ">

        <h1 style="
          color:#111;
        ">

          Order Confirmed 🎉

        </h1>





        <p>

          Thank you for shopping with Frobag.

        </p>





        <h2>

          Order Details

        </h2>





        <ul>

          ${orderItemsHtml}

        </ul>





        <h3>

          Total:
          ₹${totalPrice}

        </h3>





        <h3>

          Shipping Address

        </h3>





        <p>

          ${shippingAddress.address},

          ${shippingAddress.city},

          ${shippingAddress.postalCode},

          ${shippingAddress.country}

        </p>





        <br />





        <p>

          Your order is being processed 🚀

        </p>

      </div>
      `;

    // ================= SEND EMAIL =================

    await sendEmail({
      email: req.user.email,

      subject: "Order Confirmation - Frobag",

      message,
    });

    // ================= RESPONSE =================

    return res.status(201).json({
      success: true,

      message: "Order Created Successfully",

      order: savedOrder,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};


// ================= GET MY ORDERS =================

const getMyOrders = async (req, res) => {

  try {

    const orders =
      await Order.find({

        user:
          req.user._id,
      })

      .sort({
        createdAt: -1,
      });





    return res.json({

      success: true,

      orders,
    });

  } catch (error) {

    console.log(error);





    return res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};

// ================= GET ORDER BY ID =================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",

      "name email",
    );

    // ================= CHECK ORDER =================

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order Not Found",
      });
    }

    // ================= RESPONSE =================

    return res.json({
      success: true,

      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= ADMIN GET ALL ORDERS =================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})

      .populate("user", "name email")

      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,

      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= UPDATE ORDER STATUS =================

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // ================= CHECK ORDER =================

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order Not Found",
      });
    }

    // ================= UPDATE STATUS =================

    order.orderStatus = req.body.orderStatus || order.orderStatus;

    // ================= DELIVERED =================

    if (req.body.orderStatus === "Delivered") {
      order.isDelivered = true;

      order.deliveredAt = Date.now();
    }

    // ================= PAID =================

    if (req.body.isPaid === true) {
      order.isPaid = true;

      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();

    // ================= RESPONSE =================

    return res.json({
      success: true,

      message: "Order Status Updated",

      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Update Failed",
    });
  }
};


// ================= SELLER GET ORDERS =================

const getSellerOrders = async (req, res) => {

  try {


    // ================= GET ALL ORDERS =================

    const orders =
      await Order.find({})

      .populate(
        "user",
        "name email"
      )

      .populate(
        "orderItems.product"
      )

      .sort({

        createdAt: -1,

      });



    // ================= FILTER SELLER ORDERS =================

    const sellerOrders =
      orders.filter((order) =>


        order.orderItems.some((item) =>


          item.product &&

          item.product.vendor &&


          item.product.vendor.toString() ===
          req.user._id.toString()


        )

      );



    // ================= RESPONSE =================

    return res.status(200).json({

      success: true,

      orders: sellerOrders,

    });


  } catch (error) {


    console.log(
      "Seller Order Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to get seller orders",

    });

  }

};


// ================= SELLER UPDATE ORDER =================

const updateSellerOrder =
  async (req, res) => {

    try {


      // ================= FIND ORDER =================

      const order =
        await Order.findById(
          req.params.id
        )
        .populate(
          "orderItems.product"
        );


      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }



      // ================= CHECK SELLER OWNERSHIP =================

      const isSellerOrder =
        order.orderItems.some(

          (item) =>

            item.product &&
            item.product.vendor &&
            item.product.vendor.toString() ===
            req.user._id.toString()

        );
// ================= SELLER UPDATE ORDER =================


      if (!isSellerOrder) {

        return res.status(403).json({

          success: false,

          message:
            "You are not authorized to update this order",

        });

      }



      // ================= UPDATE STATUS =================

      if (req.body.orderStatus) {

        order.orderStatus =
          req.body.orderStatus;

      }



      // ================= UPDATE TRACKING NUMBER =================

      if (
        req.body.trackingNumber !== undefined
      ) {

        order.trackingNumber =
          req.body.trackingNumber;

      }



      // ================= DELIVERY STATUS =================

      if (
        order.orderStatus === "Delivered"
      ) {

        order.isDelivered =
          true;


        order.deliveredAt =
          Date.now();

      } else {

        order.isDelivered =
          false;


        order.deliveredAt =
          null;

      }



      // ================= SAVE ORDER =================

      const updatedOrder =
        await order.save();



      // ================= RESPONSE =================

      return res.status(200).json({

        success: true,

        message:
          "Order updated successfully",

        order:
          updatedOrder,

      });


    } catch (error) {


      console.log(
        "Seller Update Order Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


  // ================= CANCEL ORDER =================

const cancelOrder =
  async (req, res) => {

    try {

      // ================= FIND ORDER =================

      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }


      // ================= CHECK OWNER =================

      if (

        order.user.toString() !==
        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ================= CHECK STATUS =================

      const allowedStatus = [

        "Processing",

        "Confirmed",

        "Packed",

      ];


      if (

        !allowedStatus.includes(
          order.orderStatus
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Order cannot be cancelled now",

        });

      }


      // ================= RESTORE STOCK =================

      for (

        const item of order.orderItems

      ) {


        const product =
          await Product.findById(
            item.product
          );


        if (product) {


          product.countInStock +=
            item.qty;


          await product.save();

        }

      }


      // ================= UPDATE ORDER =================

      order.orderStatus =
        "Cancelled";


      order.cancelledBy =
        "User";


      order.cancelReason =
        req.body.reason ||
        "Cancelled by customer";


      order.cancelledAt =
        Date.now();


      await order.save();


      // ================= RESPONSE =================

      return res.status(200).json({

        success: true,

        message:
          "Order cancelled successfully",

        order,

      });


    } catch (error) {


      console.log(
        "Cancel Order Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

  // ================= REQUEST RETURN =================

const requestReturn =
  async (req, res) => {

    try {

      // ================= FIND ORDER =================

      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }


      // ================= CHECK ORDER OWNER =================

      if (

        order.user.toString() !==
        req.user._id.toString()

      ) {

        return res.status(403).json({

          success: false,

          message:
            "You are not authorized",

        });

      }


      // ================= CHECK DELIVERED =================

      if (!order.isDelivered) {

        return res.status(400).json({

          success: false,

          message:
            "You can request a return only after delivery",

        });

      }


      // ================= CHECK EXISTING REQUEST =================

      if (

        order.returnStatus !== "None"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Return request already submitted",

        });

      }


      // ================= VALIDATE REASON =================

      if (!req.body.reason) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide a return reason",

        });

      }


      // ================= UPDATE RETURN DETAILS =================

      order.returnRequested = true;


      order.returnReason =
        req.body.reason;


      order.returnStatus =
        "Pending";


      // ================= SAVE =================

      await order.save();


      // ================= RESPONSE =================

      return res.status(200).json({

        success: true,

        message:
          "Return request submitted successfully",

        order,

      });


    } catch (error) {


      console.log(
        "Return Request Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


  // ================= SELLER UPDATE RETURN STATUS =================

const updateReturnStatus =
  async (req, res) => {

    try {


      // ================= FIND ORDER =================

      const order =
        await Order.findById(
          req.params.id
        )
        .populate(
          "orderItems.product"
        );


      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }



      // ================= CHECK SELLER OWNERSHIP =================

      const isSellerOrder =
        order.orderItems.some(

          (item) =>

            item.product &&
            item.product.vendor &&
            item.product.vendor.toString()
            === req.user._id.toString()

        );


      if (!isSellerOrder) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      // ================= CHECK RETURN REQUEST =================

      if (

        order.returnStatus !== "Pending"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "No pending return request",

        });

      }



      // ================= VALIDATE STATUS =================

      const status =
        req.body.returnStatus;


      if (

        status !== "Approved" &&
        status !== "Rejected"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid return status",

        });

      }



      // ================= UPDATE RETURN STATUS =================

      order.returnStatus =
        status;


      await order.save();



      // ================= RESPONSE =================

      return res.status(200).json({

        success: true,

        message:
          `Return ${status.toLowerCase()} successfully`,

        order,

      });


    } catch (error) {


      console.log(
        "Update Return Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ================= EXPORTS =================

module.exports = {
  createOrder,

  getMyOrders,

  getOrderById,

  getAllOrders,

  updateOrderStatus,

  getSellerOrders,

  updateSellerOrder,

  cancelOrder,

  requestReturn,

  updateReturnStatus,
};
