import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

const NavbarLadingPage = () => {
  return (
    <div className=" bg-slate-50">
      <div className="flex justify-center p-5 shadow-lg">
        <div className="flex items-center">
          <div>
            <SignedIn>
              <div className=" flex justify-center m-2">
                <Link
                  href="/data"
                  className="w-full text-center rounded-3xl bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
                >
                  Go to Data <LogIn className="inline" />
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
        <div>
          <SignedOut>
            <div className=" flex justify-center m-2">
              <Link
                href="/sign-in"
                className="w-full text-center rounded-3xl bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
              >
                Login <LogIn className="inline" />
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default NavbarLadingPage;
