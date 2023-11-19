"use client";

import { useState } from "react";
import UserNameUpdate from "./UserNameUpdate";
import PasswordReset from "./PasswordReset";
import EmailUpdate from "./EmailUpdate";
import DeleteAccount from "./DeleteAccount";

const AdvacncedSettings = ({ username, email }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const options = [
    {
      label: "Reset Password",
      content: <PasswordReset />,
    },
    {
      label: "Update Email",
      content: <EmailUpdate currentEamil={email} />,
    },
    {
      label: "Update Username",
      content: <UserNameUpdate currentUsername={username} />,
    },
    {
      label: "Delete Account",
      content: <DeleteAccount currentEmail={email} />,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      {options.map((option, index) => (
        <div key={index} className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-md font-medium">
            {option?.label || ""}
          </div>
          <div className="collapse-content">
            <div className="text-sm leading-relaxed tracking-wide">
              {option?.content || <></>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvacncedSettings;
