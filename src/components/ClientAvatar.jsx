import React from "react";
import Avatar from "react-avatar";

const ClientAvatar = ({ username }) => {
  return (
    <div className="flex flex-col m-2 text-center items-center">
      <Avatar name={username} size="50" round="14px" />
      <span className="mt-2">{username}</span>
    </div>
  );
};

export default ClientAvatar;
