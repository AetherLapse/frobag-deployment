const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");




// ================= USER SCHEMA =================

const userSchema =
  new mongoose.Schema(

    {

      // NAME

      name: {

        type: String,

        required: true,
      },





      // EMAIL

      email: {

        type: String,

        required: true,

        unique: true,
      },





      // PASSWORD

      password: {

        type: String,

        required: true,
      },





      // OTP

      otp: {

        type: String,
      },





      // OTP EXPIRE

      otpExpire: {

        type: Date,
      },





      // VERIFIED

      isVerified: {

        type: Boolean,

        default: false,
      },





      // ADMIN

      isAdmin: {

        type: Boolean,

        default: false,
      },





      // ROLE

      role: {

        type: String,

        enum: [
          "user",
          "vendor",
          "admin"
        ],

        default: "user",
      },





      // ================= SELLER DETAILS =================

      storeName: {

        type: String,

        default: "",
      },





      phone: {

        type: String,

        default: "",
      },





      panNumber: {

        type: String,

        default: "",
      },





      gstNumber: {

        type: String,

        default: "",
      },





      bankAccount: {

        type: String,

        default: "",
      },





      ifscCode: {

        type: String,

        default: "",
      },





      address: {

        type: String,

        default: "",
      },





      // ================= SELLER APPROVAL =================

      isVendorApproved: {

        type: Boolean,

        default: false,
      },

    },

    {

      timestamps: true,
    }
  );




// ================= HASH PASSWORD =================

userSchema.pre(

  "save",

  async function () {

    // IF PASSWORD NOT MODIFIED

    if (
      !this.isModified(
        "password"
      )
    ) {

      return;
    }




    // GENERATE SALT

    const salt =
      await bcrypt.genSalt(
        10
      );




    // HASH PASSWORD

    this.password =
      await bcrypt.hash(

        this.password,

        salt
      );
  }
);




// ================= MATCH PASSWORD =================

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(

      enteredPassword,

      this.password
    );
  };




// ================= EXPORT =================

const User =
  mongoose.model(
    "User",
    userSchema
  );

module.exports = User;