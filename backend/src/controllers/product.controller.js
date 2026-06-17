const Product =
  require("../models/product.model");

// const sellerDashboard = require("./seller.controller")

const cloudinary =
  require("../config/cloudinary");



// ================= CREATE PRODUCT =================

const createProduct =
  async (req, res) => {

    try {

      console.log(req.body);

      console.log(req.file);




      let imageUrl = "";




      // ================= IMAGE UPLOAD =================

      if (req.file) {

        const result =
          await cloudinary.uploader.upload(

            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,

            {
              folder:
                "frobag_products",
            }
          );




        imageUrl =
          result.secure_url;
      }




      // ================= CREATE PRODUCT =================

      const product =
        await Product.create({

          name:
            req.body.name,

          description:
            req.body.description,

          price:
            Number(req.body.price),

          originalPrice:
            Number(req.body.originalPrice) || 0,

          brand:
            req.body.brand,

          category:
            req.body.category,

          countInStock:
            req.body.countInStock,

          image:
            imageUrl,

          vendor:
            req.user._id,
        });




      res.status(201).json({

        success: true,

        product,
      });

    } catch (error) {

      console.log(error);




      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ================= GET ALL PRODUCTS =================

const getProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find();




      res.json({

        success: true,

        products,
      });

    } catch (error) {

      console.log(error);




      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ================= GET SINGLE PRODUCT =================

const getSingleProduct =
  async (req, res) => {

    try {

     const product =
  await Product.findById(
    req.params.id
  )

  .populate(
    "vendor",
    "name storeName"
  );




      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }




      res.json({

        success: true,

        product,
      });

    } catch (error) {

      console.log(error);




      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ================= UPDATE PRODUCT =================

const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      const ownerId =
        product.vendor ||
        product.user;

      if (

        ownerId &&

        ownerId.toString() !==
        req.user._id.toString() &&

        !req.user.isAdmin

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized to edit this product",
        });
      }

      let imageUrl =
        product.image;

      if (req.file) {

        const result =
          await cloudinary.uploader.upload(

            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,

            {
              folder:
                "frobag_products",
            }
          );

        imageUrl =
          result.secure_url;
      }

      product.name =
        req.body.name ??
        product.name;

      product.description =
        req.body.description ??
        product.description;

      product.price =
        req.body.price ??
        product.price;

      product.originalPrice =
        req.body.originalPrice ??
        product.originalPrice;

      product.brand =
        req.body.brand ??
        product.brand;

      product.category =
        req.body.category ??
        product.category;

      product.countInStock =
        req.body.countInStock ??
        product.countInStock;

      product.image =
        imageUrl;

      const updatedProduct =
        await product.save();

      res.json({

        success: true,

        product:
          updatedProduct,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ================= DELETE PRODUCT =================

const deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      const ownerId =
        product.vendor ||
        product.user;

      if (

        ownerId &&

        ownerId.toString() !==
        req.user._id.toString() &&

        !req.user.isAdmin

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized to delete this product",
        });
      }

      await product.deleteOne();

      res.json({

        success: true,

        message:
          "Product deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


// ================= CREATE REVIEW =================

const createProductReview =
  async (req, res) => {

    try {

      const {
        rating,
        comment,
      } = req.body;





      const product =
        await Product.findById(
          req.params.id
        );





      if (!product) {

        return res.status(404).json({

          message:
            "Product Not Found",
        });
      }





      // CHECK IF USER ALREADY REVIEWED

      const alreadyReviewed =

        product.reviews.find(

          (review) =>

            review.user.toString() ===
            req.user._id.toString()
        );





      if (alreadyReviewed) {

        return res.status(400).json({

          message:
            "Product already reviewed",
        });
      }





      // CREATE REVIEW

      const review = {

        user:
          req.user._id,

        name:
          req.user.name,

        rating:
          Number(rating),

        comment,
      };





      // PUSH REVIEW

      product.reviews.push(
        review
      );





      // UPDATE REVIEW COUNT

      product.numReviews =
        product.reviews.length;





      // UPDATE AVERAGE RATING

      product.rating =

        product.reviews.reduce(

          (acc, item) =>

            item.rating + acc,

          0
        ) /

        product.reviews.length;


      await product.save();



      res.status(201).json({

        message:
          "Review Added Successfully",
      });

    } catch (error) {

      res.status(500).json({

        message:
          "Failed To Add Review",

        error:
          error.message,
      });
    }
  };


// ================= SELLER PRODUCTS =================

const getSellerProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          vendor:
            req.user._id,
        });

      res.json({

        success: true,

        products,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


// ================= SELLER DASHBOARD =================

const getSellerDashboard =
  async (req, res) => {

    try {

      console.log(
        "Logged In Seller:",
        req.user._id
      );

      const products =
        await Product.find({
          vendor:
            req.user._id,
        });

      console.log(
        "Products Found:",
        products.length
      );

      res.status(200).json({

        success: true,

        totalProducts:
          products.length,

        totalOrders: 0,

        totalSales: 0,

        pendingOrders: 0,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


  // ================= GET SELLER STORE =================

const getSellerStore =
  async (req, res) => {

    try {

      const sellerId =
        req.params.sellerId;

      const products =
        await Product.find({

          vendor:
            sellerId,

        })

        .populate(
          "vendor",
          "name storeName"
        );



      if (!products.length) {

        return res.status(404).json({

          success: false,

          message:
            "No products found",

        });

      }



      res.status(200).json({

        success: true,

        seller: {

          name:
            products[0].vendor?.name,

          storeName:
            products[0].vendor?.storeName,

        },

        products,

      });

    }

    catch (error) {

      console.log(
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };



module.exports = {

  createProduct,

  getProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

  createProductReview,

  getSellerProducts,

  getSellerDashboard,

  getSellerStore,

};