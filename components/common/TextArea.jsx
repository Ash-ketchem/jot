"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { CldUploadButton } from "next-cloudinary";
import { useCallback, useRef, useState } from "react";

const TextArea = ({
  placeholder,
  submitLabel,
  isLoading,
  setIsLoading,
  options,
  handleSubmit,
  btnSize,
}) => {
  const [jot, setJot] = useState("");
  const jotRef = useRef("");

  const lineRef = useRef(null);

  const textAreaRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
      setJot(e.target.value);
      jotRef.current = e.target.value;
    },

    [jot]
  );

  const [uploadEnabled, setUploadEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-2 py-4">
      <div>
        <textarea
          className="w-full resize-none outline-none peer bg-transparent"
          value={jot}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          ref={textAreaRef}
          maxLength={300}
        />
        <div
          id="container"
          className={`w-full h-auto  rounded-xl ${
            uploadEnabled ? "block" : "hidden"
          }`}
        />
        <div
          className="w-full h-[1px] bg-primary peer-focus:visible invisible mt-1"
          ref={lineRef}
        ></div>

        {options && (
          <div className="w-full py-1 mt-2">
            <CldUploadButton
              signatureEndpoint="/api/sign"
              options={{
                sources: [
                  "local",
                  "camera",
                  "google_drive",
                  "dropbox",
                  "shutterstock",
                  "gettyimages",
                  "istock",
                  "unsplash",
                ],
                inlineContainer: "#container",
                theme: "minimal",
                clientAllowedFormats: ["jpg", "png", "mov", "mp4"],
                maxFiles: 3,

                text: {
                  en: {
                    actions: {
                      upload: "jot",
                    },
                    queue: {
                      title: "uploaded images",
                    },
                  },
                },
              }}
              // disabling textarea after upoading files
              onUploadAdded={(res, options) => {
                setIsLoading(true);
              }}
              // onQueuesStart={(res, options) => {
              //   setIsLoading(true);
              // }}
              onQueuesEnd={(res, options) => {
                if (!res?.info?.files) {
                  return;
                }
                res = res?.info?.files
                  .filter((file) => file.status === "success")
                  ?.map((file) => file?.uploadInfo?.secure_url);

                if (!res?.length) return;

                handleSubmit(null, jotRef.current, res);

                options.widget.close();
                setUploadEnabled((state) => !state);
                setJot("");
                jotRef.current = "";
              }}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <PhotoIcon
                className="w-6 h-6 rounded-full hover:text-accent"
                onClick={(e) => {
                  setUploadEnabled((state) => !state);
                }}
              />
            </CldUploadButton>
          </div>
        )}
      </div>

      {!uploadEnabled && (
        <div className="flex w-full justify-end items-center mt-4">
          <button
            className={`btn btn-primary text-primary-content  rounded-full leading-relaxed btn-${btnSize} p-2  h-fit w-fit`}
            onClick={(e) => {
              console.log(jot);
              handleSubmit(e, jot);
              setJot("");
              textAreaRef.current.style.height = "auto";
            }}
            disabled={isLoading}
          >
            <span className=" text-sm lowercase tracking-wide mx-2">
              {submitLabel}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TextArea;
