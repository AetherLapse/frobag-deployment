const express =
  require("express");

const router =
  express.Router();

const nodemailer =
  require("nodemailer");




// ================= CONTACT ROUTE =================

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        message,
      } = req.body;





      // ================= VALIDATION =================

      if (
        !name ||
        !email ||
        !phone ||
        !message
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all fields",
        });
      }





      // ================= TRANSPORTER =================

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {

            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,
          },
        });





      // ================= SEND EMAIL =================

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          process.env.EMAIL_USER,

        replyTo:
          email,

        subject:
          "New Contact Message - Frobag",

        html: `

          <div style="font-family:sans-serif;padding:20px">

            <h2>New Contact Message</h2>

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Phone:</strong>
              ${phone}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p>
              ${message}
            </p>

          </div>
        `,
      });





      // ================= SUCCESS =================

      res.status(200).json({

        success: true,

        message:
          "Message Sent Successfully",
      });

    } catch (error) {

      console.log(error);





      res.status(500).json({

        success: false,

        message:
          "Failed To Send Message",
      });
    }
  }
);

module.exports =
  router;