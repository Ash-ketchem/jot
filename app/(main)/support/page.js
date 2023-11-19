"use client";

import toastStore from "@/stores/toastStore";
import { useCallback, useRef, useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const addToast = toastStore((state) => state.addToast);

  const formRef = useRef();

  const handleSubmit = useCallback(
    (e) => {
      try {
        setLoading(true);
        if (name && email && message) {
          addToast("Will get back to you soon!!");
        }
        formRef.current.submit();
      } catch (error) {
        addToast("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [name, email, message]
  );
  return (
    <div className="max-h-[90vh] flex items-center justify-center">
      <div className=" p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary leading-relaxed tracking-wide">
          Contact and Support
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          We're here to assist you! Please fill out the form below, and we'll
          get back to you as soon as possible.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => e.preventDefault()}
          ref={formRef}
        >
          <div>
            <label className="label text-sm font-semibold">
              <span className="label-text-alt">Your Name</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2  rounded-md focus:outline-none focus:border-primary"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className=" label text-sm font-semibold">
              <span className="label-text-alt">Email Address</span>
            </label>
            <input
              type="email"
              className="w-full px-4 py-2  rounded-md focus:outline-none focus:border-primary"
              placeholder="john.doe@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label text-sm font-semibold">
              <span className="label-text-alt"> Message</span>
            </label>
            <textarea
              className="w-full h-32 px-4 py-2  rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter your message here..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
