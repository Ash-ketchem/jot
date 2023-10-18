import React from "react";

function About() {
  return (
    <div className="w-full h-full px-2 py-4 flex flex-col gap-6">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl leading-tight">About Us</h1>
        <p className="text-lg text-gray-400">
          Welcome to Jot, the premier social media platform for meaningful
          connections.
        </p>

        <h2 className="font-bold text-2xl leading-tight">Our Mission</h2>
        <p className="text-base text-gray-400 leading-relaxed">
          At Jot, we are dedicated to cultivating genuine relationships in the
          digital sphere. Our mission is to provide a secure space where
          individuals can express themselves, share their narratives, and forge
          authentic connections.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="font-bold text-2xl leading-tight">What Sets Us Apart</h2>
        <p className="text-base text-gray-400 leading-relaxed">
          Jot distinguishes itself through its distinctive features and
          unwavering commitment to user satisfaction. Here are the core elements
          that make us exceptional:
        </p>
        <ul className="text-base font-semibold text-gray-400 list-disc pl-6">
          <li className="mb-2">
            <span className="text-accent">Privacy and Security:</span> We
            prioritize your privacy and employ cutting-edge security protocols
            to safeguard your data.
          </li>
          <li className="mb-2">
            <span className="text-accent">User-Centric Design:</span> Our user
            interface is crafted for simplicity and intuitiveness, ensuring a
            seamless experience for every user.
          </li>
          <li className="mb-2">
            <span className="text-accent">Community and Support:</span> We
            nurture a supportive community where users can share ideas, seek
            assistance, and collaborate effectively.
          </li>
          <li className="mb-2">
            <span className="text-accent">Content Moderation:</span> Our
            platform is committed to fostering a positive and secure environment
            for everyone, with rigorous content moderation practices in place.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
