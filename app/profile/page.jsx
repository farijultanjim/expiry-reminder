"use client";

import { useRouter } from "next/navigation";
import React from "react";

const ProfilePage = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
      });
      router.push("/")
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      ProfilePage
      <div>
        <button onClick={logout} className="p-3 bg-red-400 cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
