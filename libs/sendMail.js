import { EmailTemplate } from "@/components/emails/Template";
import transporter from "@/libs/transporter";

const sendMail = ({ username, action, token, recipient }) => {
  const emailHtml = EmailTemplate({
    username,
    action,
    token,
  });

  if (!emailHtml) {
    return null;
  }

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: recipient,
    subject: "Verification",
    html: emailHtml,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error(error);
      }

      console.log("Email sent: " + info.response);
    });

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default sendMail;
