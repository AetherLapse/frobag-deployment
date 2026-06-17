const User = require("../models/user.model");

const generateToken = require("../utils/generateToken");

const generateOTP = require("../utils/generateOTP");

const sendEmail = require("../utils/sendEmail");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const {
      name,

      email,

      password,

      role,
    } = req.body;

    // ================= EMPTY CHECK =================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,

        message: "Please fill all fields",
      });
    }

    // ================= PASSWORD VALIDATION =================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,

        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    // ================= CHECK USER EXISTS =================

    const userExists = await User.findOne({
      email,
    });
    if (userExists) {
      // ================= CHECK VERIFIED USER =================

      if (userExists.isVerified) {
        return res.status(400).json({
          success: false,

          message: "User Already Exists",
        });
      }

      // ================= GENERATE NEW OTP =================

      const otp = generateOTP();

      // ================= UPDATE OLD USER DATA =================

      userExists.name = name;

      userExists.password = password;

      // ================= ROLE =================

      userExists.role =
        role === "admin" ? "admin" : role === "vendor" ? "vendor" : "user";

      // ================= ADMIN =================

      userExists.isAdmin = role === "admin";

      // ================= VENDOR APPROVAL =================

      userExists.isVendorApproved = role === "vendor" ? false : true;

      // ================= UPDATE OTP =================

      userExists.otp = otp;

      userExists.otpExpire = Date.now() + 10 * 60 * 1000;

      // ================= SAVE USER =================

      await userExists.save();

      // ================= SEND OTP AGAIN =================

      await sendEmail({
        email,

        subject: "Verify Your Account",

        message: `

<div style="
  background-color:#f5f5f5;
  padding:40px 20px;
  font-family:Arial, Helvetica, sans-serif;
">

  <div style="
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,0.1);
  ">


    <!-- Header -->

    <div style="
      background:#000000;
      color:white;
      text-align:center;
      padding:25px;
    ">

      <h1 style="
        margin:0;
        font-size:32px;
        letter-spacing:1px;
      ">
        FROBAG
      </h1>

      <p style="
        margin-top:8px;
        color:#cccccc;
        font-size:14px;
      ">
        Premium Shopping Experience
      </p>

    </div>


    <!-- Body -->

    <div style="
      padding:35px;
      text-align:center;
    ">

      <h2 style="
        color:#111827;
        margin-bottom:15px;
      ">
        Verify Your Account
      </h2>


      <p style="
        color:#6b7280;
        font-size:16px;
        line-height:1.6;
      ">
        Welcome to Frobag! Use the verification code below
        to complete your account registration.
      </p>


      <!-- OTP Box -->

      <div style="
        margin:30px auto;
        background:#f3f4f6;
        border:2px dashed #000000;
        width:fit-content;
        padding:15px 35px;
        border-radius:12px;
      ">

        <span style="
          font-size:36px;
          font-weight:bold;
          letter-spacing:10px;
          color:#000000;
        ">

          ${otp}

        </span>

      </div>


      <p style="
        color:#ef4444;
        font-weight:bold;
        font-size:14px;
      ">
        This OTP will expire in 10 minutes.
      </p>


      <p style="
        margin-top:25px;
        color:#6b7280;
        font-size:14px;
        line-height:1.6;
      ">
        Do not share this OTP with anyone.
        Frobag will never ask for your password or verification code.
      </p>


    </div>


    <!-- Footer -->

    <div style="
      background:#111827;
      color:#d1d5db;
      text-align:center;
      padding:20px;
      font-size:13px;
    ">

      © 2026 Frobag. All rights reserved.

      <br><br>

      This is an automated message,
      please do not reply to this email.

    </div>


  </div>

</div>

`,
      });

      // ================= RESPONSE =================

      return res.status(200).json({
        success: true,

        message: "New OTP sent to your email",
      });
    }
    // ================= GENERATE OTP =================

    const otp = generateOTP();

    // ================= CREATE NEW USER =================

    await User.create({
      name,

      email,

      password,

      // ================= ROLE =================

      role: role === "admin" ? "admin" : role === "vendor" ? "vendor" : "user",

      // ================= ADMIN =================

      isAdmin: role === "admin",

      // ================= VENDOR APPROVAL =================

      isVendorApproved: role === "vendor" ? false : true,

      // ================= OTP =================

      otp,

      // ================= OTP EXPIRE =================

      otpExpire: Date.now() + 10 * 60 * 1000,

      // ================= ACCOUNT STATUS =================

      isVerified: false,
    });

    // ================= SEND OTP EMAIL =================

    await sendEmail({
      email,

      subject: "Verify Your Account",

      message: `

          <div style="
            font-family:Arial;
            padding:20px;
          ">


            <h1>

              Frobag OTP Verification

            </h1>




            <h2>

              Your OTP is:

            </h2>




            <h1 style="
              color:#2563eb;
              letter-spacing:5px;
            ">

              ${otp}

            </h1>




            <p>

              OTP valid for 10 minutes.

            </p>


          </div>

        `,
    });

    // ================= REGISTER RESPONSE =================

    return res.status(201).json({
      success: true,

      message: "OTP Sent To Email",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Register Failed",
    });
  }
};

// ================= VERIFY OTP =================

const verifyOTP = async (req, res) => {
  try {
    const {
      email,

      otp,
    } = req.body;

    // ================= FIND USER =================

    const user = await User.findOne({
      email,
    });

    // ================= CHECK USER =================

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User Not Found",
      });
    }

    // ================= CHECK OTP =================

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,

        message: "Invalid OTP",
      });
    }

    // ================= CHECK OTP EXPIRY =================

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,

        message: "OTP Expired",
      });
    }
    // ================= VERIFY USER =================

    user.isVerified = true;

    // ================= REMOVE OTP =================

    user.otp = null;

    user.otpExpire = null;

    // ================= SAVE USER =================

    await user.save();

    // ================= GENERATE TOKEN =================

    const token = generateToken(user._id);

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,

      message: "Account Verified Successfully",

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        isAdmin: user.isAdmin,

        isVendorApproved: user.isVendorApproved,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    const {
      email,

      password,
    } = req.body;

    // ================= CHECK EMPTY =================

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Please fill all fields",
      });
    }

    // ================= FIND USER =================

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "User Not Found",
      });
    }

    // ================= CHECK VERIFIED =================

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,

        message: "Please Verify OTP First",
      });
    }

    // ================= CHECK PASSWORD =================

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid Password",
      });
    }

    // ================= SELLER APPROVAL =================

    if (user.role === "vendor" && !user.isVendorApproved) {
      return res.status(401).json({
        success: false,

        message: "Seller account pending approval",
      });
    }

    // ================= GENERATE TOKEN =================

    const token = generateToken(user._id);
    // console.log("LOGIN TOKEN:", token);

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        isAdmin: user.isAdmin,

        role: user.role,

        isVendorApproved: user.isVendorApproved,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Login Failed",
    });
  }
};

// ================= SELLER SETUP =================

const sellerSetup = async (req, res) => {
  try {
    // ================= GET DATA =================

    let {
      storeName,

      phone,

      panNumber,

      gstNumber,

      bankAccount,

      ifscCode,

      address,
    } = req.body;

    // ================= CLEAN DATA =================

    storeName = storeName?.trim();

    phone = phone?.trim();

    panNumber = panNumber?.trim().toUpperCase();

    gstNumber = gstNumber?.trim().toUpperCase();

    bankAccount = bankAccount?.trim();

    ifscCode = ifscCode?.trim().toUpperCase();

    address = address?.trim();

    // ================= EMPTY CHECK =================

    if (
      !storeName ||
      !phone ||
      !panNumber ||
      !gstNumber ||
      !bankAccount ||
      !ifscCode ||
      !address
    ) {
      return res.status(400).json({
        success: false,

        message: "Please fill all seller details",
      });
    }

    // ================= VALIDATIONS =================

    if (storeName.length < 3) {
      return res.status(400).json({
        success: false,

        message: "Store name must be minimum 3 characters",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,

        message: "Invalid phone number",
      });
    }
    // ================= PAN VALIDATION =================

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      return res.status(400).json({
        success: false,

        message: "Invalid PAN Number",
      });
    }

    // ================= GST VALIDATION =================

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstNumber)) {
      return res.status(400).json({
        success: false,

        message: "Invalid GST Number",
      });
    }

    // ================= BANK ACCOUNT VALIDATION =================

    if (!/^\d{9,18}$/.test(bankAccount)) {
      return res.status(400).json({
        success: false,

        message: "Invalid Bank Account Number",
      });
    }

    // ================= IFSC VALIDATION =================

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      return res.status(400).json({
        success: false,

        message: "Invalid IFSC Code",
      });
    }

    // ================= ADDRESS VALIDATION =================

    if (address.length < 10) {
      return res.status(400).json({
        success: false,

        message: "Enter complete business address",
      });
    }

    // ================= FIND USER =================

    const user = await User.findOne({
      email: req.params.email,
    });

    // ================= CHECK USER =================

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    // ================= UPDATE SELLER DETAILS =================

    user.storeName = storeName;

    user.phone = phone;

    user.panNumber = panNumber;

    user.gstNumber = gstNumber;

    user.bankAccount = bankAccount;

    user.ifscCode = ifscCode;

    user.address = address;

    // ================= UPDATE ROLE =================

    user.role = "vendor";

    // ================= SELLER APPROVAL =================

    // New sellers need admin approval

    user.isVendorApproved = false;

    // ================= SAVE USER =================

    await user.save();

    // ================= GENERATE TOKEN =================

    const token = generateToken(user._id);

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,

      message:
        "Seller profile submitted successfully. Waiting for admin approval",

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        isAdmin: user.isAdmin,

        isVendorApproved: user.isVendorApproved,
      },
    });
  } catch (error) {
    console.log("Seller Setup Error:", error);

    return res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// ================= LOGOUT USER =================

const logoutUser = async (req, res) => {
  try {
    return res.json({
      success: true,

      message: "User Logged Out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= GET USERS =================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    return res.json({
      success: true,

      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User Not Found",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({
      email,

      subject: "Reset Password OTP",

      message: `

          <h1>
            Password Reset OTP
          </h1>

          <h2>
            ${otp}
          </h2>

          <p>
            OTP valid for 10 minutes
          </p>
        `,
    });

    return res.status(200).json({
      success: true,

      message: "OTP Sent To Email",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Forgot Password Failed",
    });
  }
};

// ================= VERIFY RESET OTP =================

const verifyResetOTP = async (req, res) => {
  try {
    const {
      email,

      otp,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User Not Found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,

        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,

        message: "OTP Expired",
      });
    }

    return res.status(200).json({
      success: true,

      message: "OTP Verified",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "OTP Verification Failed",
    });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res) => {
  try {
    const {
      email,

      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User Not Found",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,

        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    user.password = password;

    user.otp = null;

    user.otpExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,

      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Reset Password Failed",
    });
  }
};

// ================= GET PENDING SELLERS =================

const getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "vendor",

      isVendorApproved: false,
    }).select("-password");

    return res.json({
      success: true,

      sellers,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ================= APPROVE SELLER =================

const approveSeller = async (req, res) => {
  try {
    // ================= FIND SELLER =================

    const seller = await User.findById(req.params.id);

    // ================= CHECK SELLER =================

    if (!seller) {
      return res.status(404).json({
        success: false,

        message: "Seller not found",
      });
    }

    // ================= CHECK ROLE =================

    if (seller.role !== "vendor") {
      return res.status(400).json({
        success: false,

        message: "This user is not a seller",
      });
    }

    // ================= ALREADY APPROVED =================

    if (seller.isVendorApproved) {
      return res.status(400).json({
        success: false,

        message: "Seller already approved",
      });
    }

    // ================= APPROVE SELLER =================

    seller.isVendorApproved = true;

    // ================= SAVE =================

    await seller.save();

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,

      message: "Seller approved successfully",

      seller: {
        _id: seller._id,

        name: seller.name,

        email: seller.email,

        storeName: seller.storeName,

        role: seller.role,

        isVendorApproved: seller.isVendorApproved,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// ================= EXPORTS =================

module.exports = {
  registerUser,

  verifyOTP,

  loginUser,

  sellerSetup,

  logoutUser,

  getUsers,

  forgotPassword,

  verifyResetOTP,

  resetPassword,

  getPendingSellers,

  approveSeller,
};
