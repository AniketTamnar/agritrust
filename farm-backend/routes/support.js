const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/SupportTicket");
const sendEmail = require("../utils/sendEmail");

// SEND SUPPORT REQUEST
router.post("/send", async (req, res) => {
  try {
    const { customerName, customerEmail, issue } = req.body;

    const ticket = await SupportTicket.create({
      customerName,
      customerEmail,
      issue,
    });

    const confirmLink = `${process.env.NGROK_URL}/api/support/confirm/${ticket._id}`;

    // EMAIL TO AGRITRUST (PLAIN TEXT VERSION)
    const message = `
📩 NEW SUPPORT REQUEST

👤 Name: ${customerName}
📧 Email: ${customerEmail}

📝 Customer Issue:
${issue}

------------------------------------
✔ To accept this request, click here:
${confirmLink}
------------------------------------

Sent by AgriTrust Support
${new Date().toDateString()}
`;

    await sendEmail(
      process.env.EMAIL_USER,
      "🌾 New Support Request | AgriTrust",
      message
    );

    res.json({ message: "Support request sent successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending support request" });
  }
});

// CONFIRM REQUEST (ADMIN)
router.get("/confirm/:id", async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.send("❌ Invalid or expired confirmation link");
    }

    ticket.status = "confirmed";
    await ticket.save();

    const message = `
✔ YOUR REQUEST HAS BEEN ACCEPTED

Hello ${ticket.customerName},

Your support request has been ACCEPTED.
Our team will resolve your issue within 24 hours.

📝 Your Issue:
${ticket.issue}

🌿 - AgriTrust Support Team
`;

    // SEND EMAIL TO CUSTOMER
    await sendEmail(
      ticket.customerEmail,
      "✔ Your Request Has Been Accepted",
      message
    );

    res.send(`
✔ Request Confirmed  
Customer has been notified.
`);
  } catch (err) {
    console.log(err);
    res.send("❌ Error confirming request");
  }
});

module.exports = router;
