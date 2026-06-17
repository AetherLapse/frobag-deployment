const jwt =
  require("jsonwebtoken");

const User =
  require("../models/user.model");




// ================= PROTECT =================

const protect =
  async (
    req,
    res,
    next
  ) => {

    let token;





    try {

      // ================= CHECK TOKEN =================

      if (

        req.headers.authorization &&

        req.headers.authorization.startsWith(
          "Bearer"
        )

      ) {

        token =
          req.headers.authorization.split(
            " "
          )[1];


console.log("TOKEN RECEIVED:", token);
console.log("JWT SECRET:", process.env.JWT_SECRET);

        // ================= VERIFY TOKEN =================

        const decoded =
          jwt.verify(

            token,

            process.env.JWT_SECRET
          );





        // ================= GET USER =================

        req.user =
          await User.findById(
            decoded.id
          ).select("-password");





        next();

      }

      else {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized",
        });
      }

    } catch (error) {

      console.log("JWT Error:", error.message);

      return res.status(401).json({

        success: false,

        message:
          "Token failed",
      });
    }
  };




// ================= ADMIN =================

const admin =
  (
    req,
    res,
    next
  ) => {

    if (

      req.user &&

      req.user.role ===
        "admin"

    ) {

      next();

    }

    else {

      return res.status(401).json({

        success: false,

        message:
          "Admin only",
      });
    }
  };




// ================= VENDOR =================

const vendor =
  (
    req,
    res,
    next
  ) => {

    if (

      req.user &&

      (

       ["vendor", "admin"].includes(
          req.user.role
        )

      )

    ) {

      next();

    }

    else {

      return res.status(401).json({

        success: false,

        message:
          "Vendor only",
      });
    }
  };




// ================= EXPORT =================

module.exports = {

  protect,

  admin,

  vendor,
};