const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateInvoice(order) {
  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const filePath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("AgriTrust Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${order.date.toDateString()}`);
  doc.text(`Customer: ${order.name}`);
  doc.text(`Email: ${order.email}`);
  doc.text(`Phone: ${order.phone}`);
  doc.text(`Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`);
  doc.moveDown();

  doc.text("Items:", { underline: true });
  order.items.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}`);
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total Amount: ₹${order.amount}`, { bold: true });

  doc.end();
  return filePath;
}

module.exports = generateInvoice;
