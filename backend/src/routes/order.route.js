// ================= IMPORTS =================

const express =
  require("express");

const router =
  express.Router();


// ================= CONTROLLERS =================

const {

  createOrder,

  getMyOrders,

  getAllOrders,

  getOrderById,

  updateOrderStatus,

  getSellerOrders,

  updateSellerOrder,

  cancelOrder,

  requestReturn,

  updateReturnStatus,

} = require(
  "../controllers/order.controller"
);


// ================= MIDDLEWARE =================

const {

  protect,

  admin,

  vendor,

} = require(
  "../middleware/auth.middleware"
);


// =================================================
// CUSTOMER ROUTES
// =================================================


// ================= CREATE ORDER =================

router.post(
  "/",
  protect,
  createOrder
);


// ================= MY ORDERS =================

router.get(
  "/myorders",
  protect,
  getMyOrders
);


// OPTIONAL SUPPORT ROUTE

router.get(
  "/my-orders",
  protect,
  getMyOrders
);


// ================= CANCEL ORDER =================

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);


// ================= REQUEST RETURN =================

router.put(
  "/:id/request-return",
  protect,
  requestReturn
);


// =================================================
// SELLER ROUTES
// =================================================


// ================= GET SELLER ORDERS =================

router.get(
  "/seller/orders",
  protect,
  vendor,
  getSellerOrders
);


// ================= UPDATE SELLER ORDER STATUS =================

router.put(
  "/seller/orders/:id",
  protect,
  vendor,
  updateSellerOrder
);


// ================= APPROVE / REJECT RETURN =================

router.put(
  "/seller/returns/:id",
  protect,
  vendor,
  updateReturnStatus
);


// =================================================
// ADMIN ROUTES
// =================================================


// ================= GET ALL ORDERS =================

router.get(
  "/",
  protect,
  admin,
  getAllOrders
);


// ================= ADMIN UPDATE ORDER =================

router.put(
  "/:id",
  protect,
  admin,
  updateOrderStatus
);


// =================================================
// COMMON ROUTES
// =================================================


// IMPORTANT:
// Keep this route at the bottom
// so it does not conflict with
// /:id/cancel or /:id/request-return


router.get(
  "/:id",
  protect,
  getOrderById
);


// ================= EXPORT =================

module.exports =
  router;