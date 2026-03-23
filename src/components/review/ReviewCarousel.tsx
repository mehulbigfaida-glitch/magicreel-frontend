import React, { useState } from "react";

interface Props {
  frontImageUrl: string;
  backImageUrl?: string;
}

const ReviewCarousel: React.FC<Props> = ({
  frontImageUrl,
  backImageUrl,
}) => {
  const [index, setIndex] = useState(0);
  const images = backImageUrl
    ? [frontImageUrl, backImageUrl]
    : [frontImageUrl];

  return (
    <div className="review-carousel">
      <img src={images[index]} alt="review" />

      {images.length > 1 && (
        <div className="carousel-controls">
          <button
            disabled={index === 0}
            onClick={() => setIndex(0)}
          >
            Front
          </button>
          <button
            disabled={index === 1}
            onClick={() => setIndex(1)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCarousel;
