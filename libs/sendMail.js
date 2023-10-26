import { EmailTemplate } from "@/components/emails/Template";
import transporter from "@/libs/transporter";

const sendMail = ({ username, action, token, recipient }) => {
  const emailHtml = EmailTemplate({
    username,
    action,
    token,
  });

  //token is a 128-bit uuid

  if (!emailHtml) {
    return null;
  }

  let textMessage = "";

  if (action === "verification") {
    textMessage = `Greetings ${username}!

    Please use the following token to verify your email:
    
    ${token}
    
    Valid for 24 hours.`;
  } else {
    textMessage = `Greetings ${username}!

    To reset your password, use the following token:
    
    ${token}
    
    Valid for 24 hours.`;
  }

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: recipient,
    subject: "Jot Verification",
    text: textMessage,
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
