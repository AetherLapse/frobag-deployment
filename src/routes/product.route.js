const express =
  require("express");

const router =
  express.Router();

  const {
  getSellerDashboard,
} = require(
  "../controllers/seller.controller"
);




// ================= CONTROLLERS =================

const {

  createProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

  createProductReview,

  getSellerProducts,

  getSellerStore,

} = require(
  "../controllers/product.controller"
);




// ================= MIDDLEWARE =================

const {

  protect,

  admin,

  vendor,

} = require(
  "../middleware/auth.middleware"
);

const upload =
  require("../middleware/upload.middleware");



//================== PRODUCTS =================
router.get(
  "/seller/products",
  protect,
  vendor,
  getSellerProducts
);

router.get(
  "/seller/dashboard",
  protect,
  vendor,
  getSellerDashboard
);


// GET ALL PRODUCTS

router.get(
  "/",
  getProducts
);

// seller store
router.get(
  "/seller/:sellerId",
  getSellerStore
);


// GET SINGLE PRODUCT

router.get(
  "/:id",
  getSingleProduct
);




// CREATE PRODUCT

router.post(
  "/",
  protect,
  vendor,
  upload.single("image"),
  createProduct
);




// UPDATE PRODUCT

router.put(
  "/:id",
  protect,
  vendor,
  upload.single("image"),
  updateProduct
);




// DELETE PRODUCT

router.delete(
  "/:id",
  protect,
  // admin,
  deleteProduct
);




// CREATE REVIEW

router.post(
  "/:id/reviews",
  protect,
  createProductReview
);







// ================= EXPORT =================

module.exports =
  router;