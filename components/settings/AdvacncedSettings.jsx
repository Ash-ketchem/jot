"use client";

import { useState } from "react";
import UserNameUpdate from "./UserNameUpdate";
import PasswordReset from "./PasswordReset";
import EmailUpdate from "./EmailUpdate";

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
            <p className="text-sm leading-relaxed tracking-wide">
              {option?.content || <></>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdvacncedSettings;
