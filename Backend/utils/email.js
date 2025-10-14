import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send order confirmation email
export const sendOrderConfirmation = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: 'Order Confirmation - ShopSmart',
      html: `
        <h1>Thank You for Your Order!</h1>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <h2>Order Items:</h2>
        <ul>
          ${order.items.map(item => `
            <li>${item.name} - Qty: ${item.quantity} - ₹${item.price}</li>
          `).join('')}
        </ul>
        <p>Your order is being processed.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent');
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
};