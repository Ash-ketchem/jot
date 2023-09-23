function About() {
  return (
    <div className="w-full h-full px-2 py-4 flex flex-col gap-2">
      <div className="space-y-4">
        <h1 className="font-bold text-lg leading-relaxed">About Us</h1>
        <p>Welcome to Jot, the ultimate social media platform!</p>

        <h2 className="font-bold text-lg leading-relaxed">Our Mission</h2>
        <p className="text-sm text-justify leading-relaxed">
          At Jot, we believe in connecting people and fostering meaningful
          relationships in the digital world. Our mission is to provide a
          platform where individuals can express themselves, share their
          stories, and connect with others in a fun and safe environment.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg leading-relaxed">
          What Sets Us Apart
        </h2>
        <p className="text-sm text-justify leading-relaxed">
          Jot stands out from the crowd with its unique features and commitment
          to user satisfaction. Here are some of the key aspects that make us
          special:
        </p>
        <ul className="text-sm font-semibold flex flex-col items-center gap-2 list-disc px-8 text-justify pb-4">
          <li>
            Privacy and Security: We take your privacy seriously and employ
            state-of-the-art security measures to protect your data.
          </li>
          <li>
            User-Centric Design: Our user interface is designed with simplicity
            and intuitiveness in mind, ensuring a seamless experience for all
            users.
          </li>
          <li>
            Community and Support: We foster a supportive community where users
            can share ideas, get help, and collaborate.
          </li>
          <li>
            Content Moderation: Our platform is dedicated to providing a
            positive and safe environment for everyone, with strict content
            moderation.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
