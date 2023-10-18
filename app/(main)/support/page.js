"use client";

const Page = () => {
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
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="label text-sm font-semibold">
              <span className="label-text-alt">Your Name</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2  rounded-md focus:outline-none focus:border-primary"
              placeholder="John Doe"
              required
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
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white rounded-md py-2 hover:bg-primary-hover transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
