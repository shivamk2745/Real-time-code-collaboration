// Home.jsx
import React from "react";
import Navbar from "../components/Navbar";
import JoinRoomDialogue from "../components/joinroomDialogue";
// import "./index.css"; // Import your CSS file

function Home() {
  return (
    <div className="flex flex-col space-y-10 bg-gradient-to-b from-slate-800 via-bgpink to-bgdark min-h-screen text-white justify-center items-center">
      <Navbar />
      <div className="flex justify-center items-center mx-5 space-x-8">
        <div className=" flex flex-col justify-center items-center space-y-4 ">
          <h1 className="font-extrabold text-5xl md:text-6xl text-center">
            Code Here.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-textpink to-textblue">
              Code Now.
            </span>
          </h1>

          <div>
            <JoinRoomDialogue />
          </div>
        </div>
        <div className=" rounded-lg border-2 overflow-hidden w-1/2">
          <img
            src="/ww1.png"
            width="800px"
            className="aspect-square  h-[490px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
