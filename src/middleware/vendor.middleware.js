const vendor =
  (req, res, next) => {

    if (
      req.user &&
      req.user.role ===
        "vendor"
    ) {

      next();

    } else {

      return res.status(403).json({

        success: false,

        message:
          "Vendor access only"

      });
    }
  };

module.exports =
  vendor;
