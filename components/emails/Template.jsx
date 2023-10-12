export const EmailTemplate = ({ username, action, token }) => {
  let message = "";

  // Check the action type to customize the email message
  if (action === "verification") {
    message = `<div>
                  <p>Please use the following token to verify your email</p>
                  <div class="token">
                    <strong>${token}</strong>
                  </div>
                    <p>valid for 24 hours</p>
                </div>`;
  } else if (action === "reset") {
    message = `<div>
                  <p>To reset your password, use the following token</p>
                  <div class="token">
                    <strong>${token}</strong>
                  </div>
                  <p>valid for 24 hours</p>
                </div>`;
  } else {
    message = null;
  }

  if (message === null) return null;

  const template = `
    <html lang="en">
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color : white
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
          }

          div{
            color : white
          }
         
          .message {
            margin-top: 20px;
            color : white
          }
          .token {
            margin-top: 30px;
            margin-bottom: 30px;
            color: #87CEEB;
            width: 100%;
            display: flex;
            justify-content: center; 
            align-items: center; 
            font-size: 0.8rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Greetings ${username}!</h1>
          <div class="message">
            ${message}
          </div>
        </div>
      </body>
    </html>`;

  return template;
};
