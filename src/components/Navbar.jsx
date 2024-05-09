import React from "react";
// import "logo-white.png";
const Navbar = () => {
  return (
    <div className="flex h-20 items-center justify-center w-full">
      <img
        width={50}
        height={50}
        src="/logo-white.png"
        alt="Code Online Logo"
      />
      <h1 className="font-bold text-xl">Code Online</h1>
    </div>
  );
};

export default Navbar;
