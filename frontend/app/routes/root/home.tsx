// Home Page (Appears first when the app is being run)

import React from "react";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Sets title
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projo" },
    { name: "description", content: "Welcome to Projo!" },
  ];
}

const HomePage = () => {
  // Checking if the page is running correctly
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Link to="/sign-in">
        <Button className="bg-blue-500 text-white">Sign In</Button>
      </Link>
      <Link to="sign-up">
        <Button className="bg-blue-500 text-white">Sign Up</Button>
      </Link>
    </div>
  );
};

export default HomePage;
