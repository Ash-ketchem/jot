const BodySection = ({ body }) => {
  if (!body) {
    return null; // Handle empty body
  }

  const paragraphs = body.split("\n").map((paragraph, index) => (
    <p key={index} className="text-md  leading-loose text-justify">
      {paragraph}
    </p>
  ));

  return (
    <div className="w-full mt-2 ml-1 sm:mb-4 whitespace-pre-wrap">
      {paragraphs}
    </div>
  );
};

export default BodySection;
