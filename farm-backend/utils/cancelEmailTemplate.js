module.exports = function cancelOrderTemplate({
  name,
  orderId,
  amount,
  paymentMethod,
  refundStatus,
}) {
  const isOnline = paymentMethod === "Razorpay";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Cancelled</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 0;">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <tr>
            <td style="background:#16a34a; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">AgriTrust</h1>
              <p style="color:#e7f9ee; margin:5px 0 0;">Order Cancellation Confirmation</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px;">Hello <b>${name}</b>,</p>

              <p style="font-size:15px;">
                Your order has been <b style="color:#dc2626;">cancelled successfully</b>.
              </p>

              <table width="100%" cellpadding="8" cellspacing="0"
                style="border-collapse:collapse; margin:20px 0;">
                <tr>
                  <td style="background:#f1f5f9; font-weight:bold;">Order ID</td>
                  <td style="background:#f8fafc;">${orderId}</td>
                </tr>
                <tr>
                  <td style="background:#f1f5f9; font-weight:bold;">Amount</td>
                  <td style="background:#f8fafc;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="background:#f1f5f9; font-weight:bold;">Payment Method</td>
                  <td style="background:#f8fafc;">${paymentMethod}</td>
                </tr>
              </table>

              ${
                isOnline
                  ? `
                <div style="background:#ecfeff; border-left:4px solid #0ea5e9; padding:15px; margin-top:20px;">
                  <p style="margin:0; font-size:14px;">
                    💰 <b>Refund Status:</b> ${refundStatus}<br/>
                    ⏳ The refund amount of <b>₹${amount}</b> will be credited to your
                    original payment method within <b>3–5 business days</b>.
                  </p>
                </div>
              `
                  : `
                <div style="background:#f0fdf4; border-left:4px solid #22c55e; padding:15px; margin-top:20px;">
                  <p style="margin:0; font-size:14px;">
                    ✔ This was a <b>Cash on Delivery</b> order.<br/>
                    No payment was charged.
                  </p>
                </div>
              `
              }

              <p style="margin-top:25px; font-size:14px;">
                If you have any questions, feel free to contact our support team.
              </p>

              <p style="margin-top:20px;">
                Thank you for choosing <b>AgriTrust</b> 🌱
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8fafc; padding:15px; text-align:center; font-size:12px; color:#64748b;">
              © ${new Date().getFullYear()} AgriTrust. All rights reserved.<br/>
              This is an automated email. Please do not reply.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};
