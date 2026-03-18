module.exports = function orderEmailTemplate(order) {
  return `
  <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #16a34a; border-radius: 12px;">
    <h2 style="color: #166534; text-align: center;">
      ✅ AgriTrust - Order Confirmation
    </h2>

    <p>Hello <b>${order.name}</b>,</p>
    <p>Thank you for your purchase. Your order has been successfully placed!</p>

    <h3 style="color: #15803d;">Order Details</h3>
    <ul style="padding-left: 15px;">
      ${order.items
        .map(
          (item) => `
          <li>
            <b>${item.name}</b> — ${item.quantity} × ₹${item.price}
          </li>
        `
        )
        .join("")}
    </ul>

    <h3 style="color: #15803d;">Delivery Address</h3>
    <p>
      ${order.address}<br />
      ${order.city}, ${order.state} - ${order.pincode}<br />
      Phone: ${order.phone}
    </p>

    <h3 style="color: #15803d;">Payment Info</h3>
    <p>
      <b>Amount:</b> ₹${order.amount}<br />
      <b>Payment ID:</b> ${order.paymentId}<br />
      <b>Date:</b> ${new Date(order.date).toLocaleString()}
    </p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 14px; text-align: center;">
      Thank you for trusting AgriTrust.<br />
      We are committed to empowering farmers.
    </p>
  </div>
  `;
};
