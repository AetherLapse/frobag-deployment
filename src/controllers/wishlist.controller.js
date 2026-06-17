const Wishlist =
  require(
    "../models/wishlist.model"
  );



// ================= ADD TO WISHLIST =================

exports.addToWishlist =
  async (req, res) => {

    try {

      const {
        productId
      } = req.body;





      const alreadyExists =
        await Wishlist.findOne({

          user: req.user._id,

          product: productId,
        });





      if (alreadyExists) {

        return res.status(400).json({

          success: false,

          message:
            "Product already in wishlist",
        });
      }





      const wishlist =
        await Wishlist.create({

          user:
            req.user._id,

          product:
            productId,
        });





      // POPULATE PRODUCT

      const populatedWishlist =
        await Wishlist.findById(
          wishlist._id
        ).populate("product");





      res.status(201).json({

        success: true,

        wishlist:
          populatedWishlist,
      });

    } catch (error) {

      console.log(error);





      res.status(500).json({

        success: false,

        message:
          "Failed to add wishlist",
      });
    }
  };




// ================= GET WISHLIST =================

exports.getWishlist =
  async (req, res) => {

    try {

      const wishlist =
        await Wishlist.find({

          user:
            req.user._id,
        })

        .populate("product")

        .sort({
          createdAt: -1,
        });





      res.status(200).json({

        success: true,

        wishlist,
      });

    } catch (error) {

      console.log(error);





      res.status(500).json({

        success: false,

        message:
          "Failed to fetch wishlist",
      });
    }
  };




// ================= REMOVE WISHLIST =================

exports.removeWishlist =
  async (req, res) => {

    try {

      const wishlist =
        await Wishlist.findOne({

          _id:
            req.params.id,

          user:
            req.user._id,
        });





      if (!wishlist) {

        return res.status(404).json({

          success: false,

          message:
            "Wishlist item not found",
        });
      }





      await wishlist.deleteOne();





      res.status(200).json({

        success: true,

        message:
          "Removed from wishlist",
      });

    } catch (error) {

      console.log(error);





      res.status(500).json({

        success: false,

        message:
          "Failed to remove wishlist",
      });
    }
  };