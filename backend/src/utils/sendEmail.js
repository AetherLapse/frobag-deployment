const nodemailer = require("nodemailer");



// ================= SEND EMAIL =================

const sendEmail = async (options) => {

  try {


    // ================= CREATE SMTP TRANSPORTER =================

    const transporter = nodemailer.createTransport({

      host: process.env.EMAIL_HOST,

      port: process.env.EMAIL_PORT,

      secure: true,

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

      },

    });




    // ================= VERIFY SMTP =================

    await transporter.verify();


    console.log(
      "SMTP Connected Successfully ✅"
    );




    // ================= CHECK RECEIVER =================

    console.log(
      "Sending Email To:",
      options.email
    );




    // ================= SEND EMAIL =================

    const info = await transporter.sendMail({

      from: `"Frobag" <${process.env.EMAIL_USER}>`,

      to: options.email,

      subject: options.subject,

      html: options.message,

    });




    // ================= SUCCESS =================

    console.log(
      "EMAIL SENT SUCCESSFULLY ✅"
    );

    console.log(
      "Message ID:",
      info.messageId
    );


    return true;


  } catch (error) {


    // ================= ERROR =================

    console.log(
      "EMAIL ERROR ❌"
    );

    console.log(error);


    return false;

  }

};



// ================= EXPORT =================

module.exports = sendEmail;