import { SignOutButton, UserButton } from "@clerk/nextjs";
import React, { ReactHTMLElement } from "react";
import { MainNav } from "./main-nav";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { Button } from "./ui/button";

export default async function Navbar() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className=" border-b">
        <div className="flex h-16 items-center">
          <MainNav />
          <MobileSidebar />
          <div className=" ml-auto flex items-center space-x-4 lg:space-x-6 mx-4">
            <Button variant={"outline"}>
              <SignOutButton />
            </Button>
          </div>
        </div>
    </div>
  );
}
