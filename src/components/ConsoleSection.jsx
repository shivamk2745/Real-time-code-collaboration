import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const ConsoleSection = () => {
  const [consoleFeed, setConsoleFeed] = useState([]);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const data = e.data;
      if (data.type === "log") {
        setConsoleFeed((prev) => [...prev, { type: "log", msg: data.args }]);
      } else if (data.type === "error") {
        setConsoleFeed((prev) => [
          ...prev,
          { type: "error", msg: `${data.args}` },
        ]);
      }
    });

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("message", (e) => {
        // Do nothing here because this is just a cleanup function
      });
    };
  }, []);

  return (
    <>
      <div className="bg-black flex items-center pl-8">
        <p>Console</p>
        <FaTrash
          onClick={() => setConsoleFeed([])}
          className="cursor-pointer ml-5"
        />
      </div>
      <div className="h-full text-black px-3 pt-3">
        {consoleFeed.map((feed) => (
          <div key={uuidv4()}>
            <p
              className={feed.type === "error" ? "text-red-600" : "text-white"}
            >
              {feed.msg}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default ConsoleSection;
