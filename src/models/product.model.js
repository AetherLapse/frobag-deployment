const mongoose =
  require("mongoose");


// ================= REVIEW SCHEMA =================

const reviewSchema =
  new mongoose.Schema({

    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    name: {

      type: String,

      required: true,
    },

    rating: {

      type: Number,

      required: true,
    },

    comment: {

      type: String,

      required: true,
    },

    createdAt: {

      type: Date,

      default: Date.now,
    },

  });




// ================= PRODUCT SCHEMA =================

const productSchema =
  new mongoose.Schema(

    {

      name: {

        type: String,

        required: true,
      },

      description: {

        type: String,

        required: true,
      },

      price: {

        type: Number,

        required: true,
      },

      originalPrice: {

        type: Number,

        default: 0,
      },

      image: {

        type: String,

        required: true,
      },

      category: {

        type: String,

        required: true,
      },

      brand: {

        type: String,

        required: true,
      },

      countInStock: {

        type: Number,

        required: true,

        default: 0,
      },

      // ================= RATING =================

      rating: {

        type: Number,

        default: 0,
      },

      // ================= NUMBER OF REVIEWS =================

      numReviews: {

        type: Number,

        default: 0,
      },

      // ================= REVIEWS =================

      reviews: [

        reviewSchema
      ],

      // ================= PRODUCT OWNER =================

      vendor: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        // required: true,
      },

    },

    {

      timestamps: true,
    }
  );




module.exports =
  mongoose.model(

    "Product",

    productSchema
  );