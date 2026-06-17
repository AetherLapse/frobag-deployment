const mongoose =
  require("mongoose");


// ================= ORDER SCHEMA =================

const orderSchema =
  mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },




      orderItems: [

        {

          name: {
            type:
              String,
          },

          qty: {
            type:
              Number,
          },

          image: {
            type:
              String,
          },

          price: {
            type:
              Number,
          },

          product: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref:
              "Product",
          },
        },
      ],




      // ================= SHIPPING =================

      shippingAddress: {

        address: {
          type:
            String,

          required:
            true,
        },

        city: {
          type:
            String,

          required:
            true,
        },

        postalCode: {
          type:
            String,

          required:
            true,
        },

        country: {
          type:
            String,

          required:
            true,
        },
      },




      paymentMethod: {

        type:
          String,

        required:
          true,
      },


      // ================= PAYMENT STATUS =================

      isPaid: {

        type:
          Boolean,

        default:
          false,

      },


      paidAt: {

        type:
          Date,

      },


      // ================= PAYMENT DETAILS =================

      paymentResult: {

        id: String,

        status: String,

        update_time: String,

        email_address: String,

      },


      // ================= TOTAL PRICE =================

      totalPrice: {

        type:
          Number,

        required:
          true,

        default:
          0,
      },




      orderStatus: {

        type:
          String,

        enum: [

          "Processing",

          "Confirmed",

          "Packed",

          "Shipped",

          "Out For Delivery",

          "Delivered",

          "Cancelled",

        ],

        default:
          "Processing",

      },

      trackingNumber: {

        type:
          String,

        default:
          "",

      },

      // ================= ORDER CANCELLATION =================

cancelledBy: {

  type:
    String,

  enum: [

    "User",

    "Seller",

    "Admin",

  ],

  default:
    null,

},


cancelReason: {

  type:
    String,

    default:
    "",

},


cancelledAt: {

  type:
    Date,

},


// ================= RETURN REQUEST =================

returnRequested: {

  type:
    Boolean,

  default:
    false,

},


returnReason: {

  type:
    String,

  default:
    "",

},


returnStatus: {

  type:
    String,

  enum: [

    "None",

    "Pending",

    "Approved",

    "Rejected",

  ],

  default:
    "None",

},




      isDelivered: {

        type:
          Boolean,

        default:
          false,
      },




      deliveredAt: {
        type:
          Date,
      },

    },

    {
      timestamps:
        true,
    }
  );




module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );