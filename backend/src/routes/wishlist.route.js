const express =
  require("express");

const router =
  express.Router();

const {

  addToWishlist,

  getWishlist,

  removeWishlist,

} = require(

  "../controllers/wishlist.controller"
);

const {
  protect
} = require(

  "../middleware/auth.middleware"
);




// ADD

router.post(
  "/",
  protect,
  addToWishlist
);




// GET

router.get(
  "/",
  protect,
  getWishlist
);




// REMOVE

router.delete(
  "/:id",
  protect,
  removeWishlist
);

module.exports =
  router;

  