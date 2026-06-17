// const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             email: true,
//         },
//         message: {
//             type: String,
//             required: true,

//         }
//     },
//     {
//         timestamps: true,
//     }
// )

// const Contact = mongoose.model("Contact", contactSchema);

// module.exports = Contact;


const mongoose =
  require("mongoose");

const contactSchema =
  mongoose.Schema(

    {

      name: String,

      email: String,

      subject: String,

      message: String,
    },

    {

      timestamps:
        true,
    }
  );

module.exports =
  mongoose.model(
    "Contact",
    contactSchema
  );