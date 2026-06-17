const Contact = require("../models/contact.model");

// ================= SEND MESSAGE =================

const sendMessage = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      message,
    } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ================= GET ALL MESSAGES =================

const getMessages = async (req, res) => {

  try {

    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      messages,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  sendMessage,
  getMessages,
};