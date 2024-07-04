"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React from "react";
import toast from "react-hot-toast";

const UserIdPage = () => {
  const { user } = useUser();

  const handleCopyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id).then(
        () => {
          toast.success("User Id copied to clipboard");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  return (
    <div className="flex flex-col justify-center md:flex-row items-center space-x-2 w-full md:w-[480px] border p-3 rounded-full shadow-md">
      <p className="font-bold text-lg md:mr-2">User Id:</p> {user?.id}
      <Button onClick={handleCopyUserId} className="">
        Copy
      </Button>
    </div>
  );
};

export default UserIdPage;
