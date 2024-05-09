import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const PrimaryButton = ({ text, link, onClickFunc }) => {
  return (
    <div className="flex justify-center items">
      {link ? (
        <Link to={link}>
          <button
            className="h-10 px-6 font-semibold rounded-md bg-green-500 text-black"
            type="button"
          >
            {text}
          </button>
        </Link>
      ) : (
        <button
          onClick={onClickFunc}
          className="h-10 px-6 font-semibold rounded-md bg-green-500 text-black"
          type="button"
        >
          {text}
        </button>
      )}
    </div>
  );
};

export default PrimaryButton;
