const express =
  require("express");

const router =
  express.Router();




// ================= CONTROLLERS =================

const {

  registerUser,

  verifyOTP,

  loginUser,

  logoutUser,

  getUsers,

  forgotPassword,

  verifyResetOTP,

  resetPassword,

  sellerSetup,

  getPendingSellers,

  approveSeller,

} = require(

  "../controllers/user.controller"
);




// ================= MIDDLEWARE =================

const {

  protect,

  admin,

} = require(
  "../middleware/auth.middleware"
);




// ================= AUTH =================

// REGISTER

router.post(

  "/register",

  registerUser
);




// VERIFY OTP

router.post(

  "/verify-otp",

  verifyOTP
);




// LOGIN

router.post(

  "/login",

  loginUser
);




// LOGOUT

router.get(

  "/logout",

  logoutUser
);




// ================= SELLER =================

// SELLER SETUP

router.put(

  "/seller-setup/:email",

  sellerSetup
);




// ================= ADMIN =================

// GET USERS

router.get(

  "/",

  protect,

  admin,

  getUsers
);




// ================= PASSWORD RESET =================

// FORGOT PASSWORD

router.post(

  "/forgot-password",

  forgotPassword
);




// VERIFY RESET OTP

router.post(

  "/verify-reset-otp",

  verifyResetOTP
);




// RESET PASSWORD

router.post(

  "/reset-password",

  resetPassword
);


// Vendor Aprove

router.get(
  "/admin/pending-sellers",

  protect,

  admin,

  getPendingSellers
);

// ================= APPROVE SELLER =================

router.put(

  "/admin/approve-seller/:id",

  protect,

  admin,

  approveSeller

);




// ================= EXPORT =================

module.exports =
  router;