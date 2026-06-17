const Cart = require("../models/cart.model");
const Product = require("../models/product.model");



// ADD TO CART
const addToCart = async (req, res) => {

  try {

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    let cart = await Cart.findOne({
      user: req.user._id
    });

    // Create cart if not exists
    if (!cart) {

      cart = await Cart.create({
        user: req.user._id,
        items: []
      });

    }

    // Check if product already exists
    const itemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId
    );

    if (itemIndex > -1) {

      cart.items[itemIndex].quantity += quantity;

    } else {

      cart.items.push({
        product: productId,
        quantity
      });

    }

    await cart.save();

    res.json({
      success: true,
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET USER CART
const getCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    res.json({
      success: true,
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// REMOVE ITEM
const removeFromCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id
    });

    cart.items = cart.items.filter(
      item =>
        item.product.toString() !== req.params.productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



module.exports = {
  addToCart,
  getCart,
  removeFromCart
};