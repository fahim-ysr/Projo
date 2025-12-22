// Utility for sending emails using SendGrid

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// Loads environment variables
dotenv.config();

if (!process.env.SEND_GRID_API || !process.env.FROM_EMAIL) {
  console.error("Missing SEND_GRID_API or FROM_EMAIL environment variable");
}

// Set SendGrid API key
sgMail.setApiKey(process.env.SEND_GRID_API);

const fromEmail = process.env.FROM_EMAIL;

// Sends an email using SendGrid
export const sendEmail = async (to, subject, html) => {
  const message = {
    to,
    from: `Projo <${fromEmail}>`,
    subject,
    html,
  };

  try {
    const sgResponse = await sgMail.send(message);
    console.log("Email sent successfully", {
      to,
      subject,
      sendgridResponse: sgResponse,
    });
    return true;
  } catch (error) {
    console.error("Error sending email", error);

    if (error?.response?.body) {
      console.error("SendGrid response body:", error.response.body);
    }
    return false;
  }
};
