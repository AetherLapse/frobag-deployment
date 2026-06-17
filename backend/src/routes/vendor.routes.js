const express =
  require("express");

const router =
  express.Router();

const {

  createProduct,

  getSellerProducts,

  deleteProduct,

  getSellerDashboard,

} = require(
  "../controllers/product.controller"
);

const {

  protect,

  vendor,

} = require(
  "../middleware/auth.middleware"
);


// ================= SELLER DASHBOARD =================

router.get(

  "/seller/dashboard",

  protect,

  vendor,

  getSellerDashboard
);


// ================= ADD PRODUCT =================

router.post(

  "/add-product",

  protect,

  vendor,

  createProduct
);


// ================= GET SELLER PRODUCTS =================

router.get(

  "/products",

  protect,

  vendor,

  getSellerProducts
);


// ================= DELETE PRODUCT =================

router.delete(

  "/delete/:id",

  protect,

  vendor,

  deleteProduct
);


// ================= EXPORT =================

module.exports =
  router;