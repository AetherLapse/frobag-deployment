const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/auth.middleware");

const { addToCart, getCart, removeFromCart} = require( "../controllers/cart.controller");




// ADD TO CART
router.post("/", protect, addToCart);



// GET CART
router.get("/", protect, getCart);



// REMOVE ITEM
router.delete(
  "/:productId",
  protect,
  removeFromCart
);



module.exports = router;