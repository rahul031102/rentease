import nodemailer from "nodemailer";

// If SMTP_HOST etc. are set, real emails are sent via that SMTP server.
// Otherwise, emails are logged to the console — useful for local dev /
// demos without needing a mail provider configured.

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, text }) => {
  const t = getTransporter();

  if (!t) {
    console.log(`\n[email:dev-mode] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return { delivered: false, mode: "console" };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || "RentEase <no-reply@rentease.app>",
      to,
      subject,
      text,
    });
    return { delivered: true, mode: "smtp" };
  } catch (err) {
    console.error("Email send failed:", err.message);
    console.log(`[email:fallback] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return { delivered: false, mode: "error", error: err.message };
  }
};

export const rentalConfirmationEmail = (user, rental) => ({
  to: user.email,
  subject: "RentEase — Your rental is confirmed",
  text: `Hi ${user.name},

Your rental order has been placed successfully.

Items:
${rental.items.map((i) => `- ${i.name} x${i.quantity} (${i.tenureMonths} months, ₹${i.monthlyRent}/mo)`).join("\n")}

Delivery date: ${new Date(rental.deliveryDate).toDateString()}
Delivery address: ${rental.deliveryAddress}, ${rental.city}

Monthly rent: ₹${rental.totalMonthlyRent}
Security deposit: ₹${rental.totalSecurityDeposit}

Thanks for renting with RentEase.`,
});

export const maintenanceRequestEmail = (user, rental, issue) => ({
  to: user.email,
  subject: "RentEase — Maintenance request received",
  text: `Hi ${user.name},

We've received your maintenance request: "${issue}"

Our team will get in touch shortly to schedule a visit.

— RentEase Support`,
});

export const statusUpdateEmail = (user, rental) => ({
  to: user.email,
  subject: `RentEase — Rental status updated to "${rental.status.replace("_", " ")}"`,
  text: `Hi ${user.name},

Your rental order status has been updated to: ${rental.status.replace("_", " ")}.

— RentEase`,
});
